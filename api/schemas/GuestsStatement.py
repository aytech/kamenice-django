import logging
import os
from datetime import datetime

from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from graphene import ObjectType, Boolean, String, Field, List, Mutation, InputObjectType
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import user_passes_test

from api.models.GuestStatement import GuestStatement
from api.models.Reservation import Reservation
from api.schemas.exceptions.PermissionDenied import PermissionDenied
from api.schemas.helpers.GuestStatementHelper import GuestStatementHelper
from kamenice_django.settings.base import STATEMENTS_ROOT


class Report(ObjectType):
    status = Boolean()
    message = String()


class RemovedDriveFile(ObjectType):
    name = String()


class DriveFile(DjangoObjectType):
    class Meta:
        model = GuestStatement
        fields = ('created', 'drive_id', 'id', 'name', 'path_pdf', 'path_docx')


class GuestsStatementQuery(ObjectType):
    guests_report = Field(Report, from_date=String(required=True), to_date=String(required=True))
    guests_report_files = List(DriveFile)

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
            helper = GuestStatementHelper(init_docs_service=True)
            helper.generate_cz_statement(reservations, start_date, end_date)
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
                helper = GuestStatementHelper()
                helper.delete_document_from_g(file_id)
                return DeleteDriveFile(file=RemovedDriveFile(name=instance.name))
            return DeleteDriveFile(file=None)
        except Exception as e:
            logging.getLogger('kamenice').error('Failed to delete file {}, error: {}'.format(file_id, e))
            return DeleteDriveFile(file=None)
