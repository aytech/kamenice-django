import io
import os
from datetime import datetime

from django.utils.translation import gettext_lazy as _
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from oauth2client.service_account import ServiceAccountCredentials

from api.models.GuestStatement import GuestStatement
from api.schemas.exceptions.Unauthorized import Unauthorized
from api.schemas.helpers.statements.cz_statement_columns import get_column_requests
from api.schemas.helpers.statements.statements_rows import get_row_data_requests
from api.schemas.helpers.statements.statements_table import get_table_requests
from api.schemas.helpers.statements.statements_cells import get_cell_styles_requests
from api.schemas.helpers.statements.statements_dates import get_report_dates_requests
from kamenice_django.settings.base import STATEMENTS_URL, STATEMENTS_ROOT, KEYS_ROOT


class GuestStatementHelper:
    SCOPES = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
    ]
    TEMPLATE_DOCUMENT_ID = os.environ.get('GUEST_STATEMENT_TEMPLATE')
    FOREIGNERS_TEMPLATE_DOCUMENT_ID = os.environ.get('FOREIGNER_STATEMENT_TEMPLATE')

    def __init__(self, init_docs_service=False):
        service_account_file = KEYS_ROOT / os.environ.get('G_SERVICE_ACCOUNT')
        if not os.path.exists(service_account_file):
            raise Unauthorized
        credentials = ServiceAccountCredentials.from_json_keyfile_name(service_account_file, scopes=self.SCOPES)
        self.drive_service = build('drive', 'v3', credentials=credentials)
        if init_docs_service:
            self.docs_service = build('docs', 'v1', credentials=credentials)

    def get_document_content(self, document_id):
        document = self.docs_service.documents().get(documentId=document_id).execute()
        return document.get('body').get('content')

    def get_service_account_credentials(self):
        service_account_file = KEYS_ROOT / os.environ.get('G_SERVICE_ACCOUNT')
        if not os.path.exists(service_account_file):
            raise Unauthorized
        return ServiceAccountCredentials.from_json_keyfile_name(service_account_file, scopes=self.SCOPES)

    def delete_document_from_g(self, document_id):
        self.drive_service.files().delete(fileId=document_id).execute()

    def download_document(self, file_id, file_name):
        statement = GuestStatement(
            drive_id=file_id,
            name=file_name
        )
        download_request_pdf = self.drive_service.files().export_media(fileId=file_id, mimeType='application/pdf')
        word_mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        download_request_docx = self.drive_service.files().export_media(fileId=file_id, mimeType=word_mime)
        download_path_pdf = STATEMENTS_ROOT / '{}.pdf'.format(file_name)
        download_path_docx = STATEMENTS_ROOT / '{}.docx'.format(file_name)
        file_handler_pdf = io.FileIO(download_path_pdf, mode='wb')
        file_handler_docx = io.FileIO(download_path_docx, mode='wb')
        downloader_pdf = MediaIoBaseDownload(file_handler_pdf, download_request_pdf)
        downloader_docx = MediaIoBaseDownload(file_handler_docx, download_request_docx)
        done_pdf = False
        done_docx = False
        while done_pdf is False:
            status, done_pdf = downloader_pdf.next_chunk()
        statement.path_pdf = '{}{}.pdf'.format(STATEMENTS_URL, file_name)
        while done_docx is False:
            status, done_docx = downloader_docx.next_chunk()
        statement.path_docx = '{}{}.docx'.format(STATEMENTS_URL, file_name)
        statement.save()

    def generate_cz_statement(self, data, start_date, end_date):
        # Init services, prepare document
        now = datetime.now()
        report_document_name = '{}-{}'.format(_('guests_statement'), now.strftime('%d%m%Y%H%M%S'))
        template_copy = self.drive_service.files().copy(fileId=self.TEMPLATE_DOCUMENT_ID,
                                                        body={'name': report_document_name}).execute()
        # Replace dates
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_report_dates_requests(start_date, end_date)}).execute()
        # Insert table
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_table_requests(self.get_document_content(template_copy.get('id')), 6, len(data))}).execute()
        # Insert data
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_row_data_requests(self.get_document_content(template_copy.get('id')),
                                              data)}).execute()
        # Fix column width(s)
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_column_requests(self.get_document_content(template_copy.get('id')))}).execute()
        # Fix cell borders
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_cell_styles_requests(
                self.get_document_content(template_copy.get('id')))}).execute()

        self.download_document(template_copy.get('id'), report_document_name)

    def generate_foreigner_statement(self, data, start_date, end_date):
        now = datetime.now()
        report_document_name = '{}-{}'.format(_('foreigners_statement'), now.strftime('%d%m%Y%H%M%S'))
        template_copy = self.drive_service.files().copy(fileId=self.FOREIGNERS_TEMPLATE_DOCUMENT_ID,
                                                        body={'name': report_document_name}).execute()
        # Replace dates
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_report_dates_requests(start_date, end_date)}).execute()
        # Insert table
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_table_requests(self.get_document_content(template_copy.get('id')), 8, len(data))}).execute()
        # Insert data
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_row_data_requests(self.get_document_content(template_copy.get('id')), data)}).execute()
        # Fix cell borders
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_cell_styles_requests(self.get_document_content(template_copy.get('id')))}).execute()
        self.download_document(template_copy.get('id'), report_document_name)
