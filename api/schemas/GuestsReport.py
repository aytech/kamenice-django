import io
import logging
import os
from datetime import datetime

from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from graphene import ObjectType, Boolean, String, Field, List, Mutation, InputObjectType
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test
from oauth2client.service_account import ServiceAccountCredentials

from api.models.GuestStatement import GuestStatement
from api.models.Reservation import Reservation
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.exceptions.Unauthorized import Unauthorized
from api.schemas.helpers.GuestReportHelper import GuestReportHelper
from kamenice_django.settings.base import STATEMENTS_URL, STATEMENTS_ROOT, KEYS_ROOT


class Report(ObjectType):
    status = Boolean()
    message = String()


class RemovedDriveFile(ObjectType):
    name = String()


class DriveFile(DjangoObjectType):
    class Meta:
        model = GuestStatement
        fields = ('created', 'drive_id', 'id', 'name', 'path_pdf', 'path_docx')


class GuestsReportQuery(ObjectType):
    SCOPES = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
    ]
    TEMPLATE_DOCUMENT_ID = os.environ.get('GUEST_STATEMENT_TEMPLATE')

    guests_report = Field(Report, from_date=String(required=True), to_date=String(required=True))
    guests_report_files = List(DriveFile)

    @classmethod
    def get_service_account_credentials(cls):
        service_account_file = KEYS_ROOT / os.environ.get('G_SERVICE_ACCOUNT')
        if not os.path.exists(service_account_file):
            raise Unauthorized
        return ServiceAccountCredentials.from_json_keyfile_name(service_account_file, scopes=GuestsReportQuery.SCOPES)

    @staticmethod
    def get_document_content(document_service, document_id):
        document = document_service.documents().get(documentId=document_id).execute()
        return document.get('body').get('content')

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.add_reservation'), exc=PermissionDenied)
    def resolve_guests_report(cls, _root, _info, from_date, to_date):
        start_date = datetime.strptime(from_date, '%Y-%m-%d')
        end_date = datetime.strptime(to_date, '%Y-%m-%d')
        reservations = Reservation.objects.filter(
            Q(
                deleted=False,
                from_date__gte=start_date,
                from_date__lte=end_date
            )
            |
            Q(
                deleted=False,
                to_date__gte=start_date,
                to_date__lte=end_date
            )
        )

        if reservations.count() == 0:
            return Report(
                status=False,
                message=_('No guests found for the selected period')
            )

        try:
            # Add headers as initial data
            data = [
                [
                    _('Room'),
                    _('Surname - Name'),
                    _('ID or Passport'),
                    _('State'),
                    _('Accommodated from - to')
                ]
            ]
            for reservation in reservations:
                data.append([
                    reservation.suite.number,
                    '{} {}'.format(reservation.guest.name, reservation.guest.surname),
                    reservation.guest.identity,
                    reservation.guest.citizenship,
                    '{} - {}'.format(
                        reservation.from_date.strftime('%d.%m.%Y'),
                        reservation.to_date.strftime('%d.%m.%Y')),
                ])
                for roommate in reservation.roommates.all():
                    data.append([
                        reservation.suite.number,
                        '{} {}'.format(roommate.name, roommate.surname),
                        roommate.identity,
                        roommate.citizenship,
                        '{} - {}'.format(
                            reservation.from_date.strftime('%d.%m.%Y'),
                            reservation.to_date.strftime('%d.%m.%Y')),
                    ])
            # Init services, prepare document
            now = datetime.now()
            drive_service = build('drive', 'v3',
                                  credentials=GuestsReportQuery.get_service_account_credentials())
            docs_service = build('docs', 'v1', credentials=GuestsReportQuery.get_service_account_credentials())
            report_document_name = '{}-{}'.format(_('guests_statement'), now.strftime('%d%m%Y%H%M%S'))
            template_copy = drive_service.files().copy(fileId=GuestsReportQuery.TEMPLATE_DOCUMENT_ID,
                                                       body={'name': report_document_name}).execute()
            # Init model
            statement = GuestStatement(
                drive_id=template_copy.get('id'),
                name=report_document_name
            )
            # Replace dates
            docs_service.documents().batchUpdate(documentId=template_copy.get('id'),
                                                 body={
                                                     'requests': GuestReportHelper.get_report_dates_requests(start_date,
                                                                                                             end_date)
                                                 }).execute()
            # Insert table
            docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
                'requests': GuestReportHelper.get_table_requests(
                    GuestsReportQuery.get_document_content(docs_service, template_copy.get('id')),
                    len(data) - 1)}).execute()
            # Insert data
            docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
                'requests': GuestReportHelper.get_row_data_requests(
                    GuestsReportQuery.get_document_content(docs_service, template_copy.get('id')), data)}).execute()
            # Fix column width(s)
            docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
                'requests': GuestReportHelper.get_column_requests(
                    GuestsReportQuery.get_document_content(docs_service, template_copy.get('id')))}).execute()
            # Fix cell borders
            docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
                'requests': GuestReportHelper.get_cell_styles_requests(
                    GuestsReportQuery.get_document_content(docs_service, template_copy.get('id')))}).execute()
            # Download file
            download_request_pdf = drive_service.files().export_media(fileId=template_copy.get('id'),
                                                                      mimeType='application/pdf')
            word_mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            download_request_docx = drive_service.files().export_media(fileId=template_copy.get('id'),
                                                                       mimeType=word_mime)
            download_path_pdf = STATEMENTS_ROOT / '{}.pdf'.format(report_document_name)
            download_path_docx = STATEMENTS_ROOT / '{}.docx'.format(report_document_name)
            file_handler_pdf = io.FileIO(download_path_pdf, mode='wb')
            file_handler_docx = io.FileIO(download_path_docx, mode='wb')
            downloader_pdf = MediaIoBaseDownload(file_handler_pdf, download_request_pdf)
            downloader_docx = MediaIoBaseDownload(file_handler_docx, download_request_docx)
            done_pdf = False
            done_docx = False
            while done_pdf is False:
                status, done_pdf = downloader_pdf.next_chunk()
            statement.path_pdf = '{}{}.pdf'.format(STATEMENTS_URL, report_document_name)
            while done_docx is False:
                status, done_docx = downloader_docx.next_chunk()
            statement.path_docx = '{}{}.docx'.format(STATEMENTS_URL, report_document_name)
            statement.save()
            return Report(
                status=True,
                message=_('Statement generated successfully')
            )
        except Exception as e:
            logging.getLogger('kamenice').error('Failed generate guests report {}'.format(e))
            return Report(
                status=False,
                message=_('Could not generate statement')
            )

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.view_reservation'), exc=PermissionDenied)
    def resolve_guests_report_files(cls, _root, _info):
        return GuestStatement.objects.order_by('-created')


class DriveFileInput(InputObjectType):
    id = String()


class DeleteDriveFile(Mutation):
    class Arguments:
        file_id = String()

    file = Field(RemovedDriveFile)

    @classmethod
    @user_passes_test(lambda user: user.has_perm('api.delete_reservation'), exc=PermissionDenied)
    def mutate(cls, _root, _info, file_id):
        try:
            instance = GuestStatement.objects.get(drive_id=file_id)
            if instance:
                # Remove from file system
                file_path_pdf = STATEMENTS_ROOT / '{}.pdf'.format(instance.name)
                file_path_docx = STATEMENTS_ROOT / '{}.docx'.format(instance.name)
                if os.path.exists(file_path_pdf):
                    os.unlink(file_path_pdf)
                if os.path.exists(file_path_docx):
                    os.unlink(file_path_docx)
                # Remove from DB
                instance.delete()
                # Remove from GDrive
                drive_service = build('drive', 'v3', credentials=GuestsReportQuery.get_service_account_credentials())
                drive_service.files().delete(fileId=file_id).execute()
                return DeleteDriveFile(file=RemovedDriveFile(name=instance.name))
            return DeleteDriveFile(file=None)
        except Exception as e:
            logging.getLogger('kamenice').error('Failed to delete file {}, error: {}'.format(file_id, e))
            return DeleteDriveFile(file=None)
