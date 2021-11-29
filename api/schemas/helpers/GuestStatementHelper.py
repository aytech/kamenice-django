import io
import os
from datetime import datetime

from django.utils.translation import gettext_lazy as _
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from oauth2client.service_account import ServiceAccountCredentials

from api.models.GuestStatement import GuestStatement
from api.schemas.exceptions.Unauthorized import Unauthorized
from kamenice_django.settings.base import STATEMENTS_URL, STATEMENTS_ROOT, KEYS_ROOT


def get_cell_styles_requests(document_content):
    requests = []
    for section in document_content:
        table = section.get('table')
        if table is not None:
            rows = table.get('tableRows')
            rows_length = len(rows)
            for row in range(rows_length - 1, -1, -1):
                cells = rows[row].get('tableCells')
                for cell in range(len(cells) - 1, -1, -1):
                    requests.append({
                        'updateParagraphStyle': {
                            'paragraphStyle': {
                                'alignment': 'CENTER',
                                'namedStyleType': 'NORMAL_TEXT'
                            },
                            'fields': '*',
                            'range': {
                                'startIndex': cells[cell].get('startIndex'),
                                'endIndex': cells[cell].get('endIndex')
                            }
                        }
                    })
                    requests.append({
                        'updateTableCellStyle': {
                            'tableCellStyle': {
                                'borderRight': {
                                    'color': {
                                        'color': {
                                            'rgbColor': {
                                                'red': 1
                                            }
                                        }
                                    },
                                    'dashStyle': 'SOLID',
                                    'width': {
                                        'magnitude': 0,
                                        'unit': 'PT'
                                    },
                                },
                                'borderLeft': {
                                    'color': {
                                        'color': {
                                            'rgbColor': {
                                                'red': 1
                                            }
                                        }
                                    },
                                    'dashStyle': 'SOLID',
                                    'width': {
                                        'magnitude': 0,
                                        'unit': 'PT'
                                    },
                                },
                                'borderBottom': {
                                    'color': {
                                        'color': {
                                            'rgbColor': {
                                                'red': 0,
                                                'green': 0,
                                                'blue': 0
                                            }
                                        }
                                    },
                                    'dashStyle': 'SOLID',
                                    'width': {
                                        'magnitude': 1 if row == 0 else 0,
                                        'unit': 'PT'
                                    },
                                },
                                'borderTop': {
                                    'color': {
                                        'color': {
                                            'rgbColor': {
                                                'red': 1
                                            }
                                        }
                                    },
                                    'dashStyle': 'SOLID',
                                    'width': {
                                        'magnitude': 0,
                                        'unit': 'PT'
                                    },
                                },
                                'contentAlignment': 'MIDDLE'
                            },
                            'fields': '*',
                            'tableRange': {
                                'tableCellLocation': {
                                    'tableStartLocation': {
                                        'segmentId': '',
                                        'index': section.get('startIndex')
                                    },
                                    'rowIndex': row,
                                    'columnIndex': cell
                                },
                                'rowSpan': 1,
                                'columnSpan': 1
                            }
                        }
                    })
    return requests


def get_report_dates_requests(from_date, to_date):
    return [
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{date_from}}',
                    'matchCase': 'true'
                },
                'replaceText': '{}.{}.{}'.format(from_date.day, from_date.month, from_date.year),
            }
        },
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{date_to}}',
                    'matchCase': 'true'
                },
                'replaceText': '{}.{}.{}'.format(to_date.day, to_date.month, to_date.year),
            }
        }
    ]


def get_table_requests(document_content, data_length):
    requests = []
    for section in document_content:
        paragraph = section.get('paragraph')
        if paragraph is not None:
            for element in paragraph.get('elements'):
                if '{{list_table}}' in element.get('textRun').get('content'):
                    requests.append({
                        'insertTable': {
                            'rows': data_length,
                            'columns': 5,
                            'location': {
                                'segmentId': '',
                                'index': element.get('startIndex')
                            }
                        },
                    })
                    requests.append({
                        'replaceAllText': {
                            'containsText': {
                                'text': '{{list_table}}',
                                'matchCase': 'true'
                            },
                            'replaceText': '',
                        }
                    })
    return requests


def get_row_data_requests(document_content, data):
    requests = []
    for section in document_content:
        table = section.get('table')
        if table is not None:
            rows = table.get('tableRows')
            for row in range(len(rows) - 1, -1, -1):
                cells = rows[row].get('tableCells')
                for cell in range(len(cells) - 1, -1, -1):
                    if data[row][cell] is not None:
                        requests.append({
                            'insertText': {
                                'location': {
                                    'index': cells[cell].get('content')[0].get('startIndex')
                                },
                                'text': str(data[row][cell])
                            }
                        })
    return requests


def get_column_requests(document_content):
    requests = []
    for section in document_content:
        table = section.get('table')
        if table is not None:
            requests.append({
                'updateTableColumnProperties': {
                    'tableStartLocation': {
                        'index': section.get('startIndex')
                    },
                    'columnIndices': table.get('columns') - 1,
                    'tableColumnProperties': {
                        'widthType': 'FIXED_WIDTH',
                        'width': {
                            'magnitude': 150,
                            'unit': 'PT'
                        }
                    },
                    'fields': '*'
                }
            })
    return requests


class GuestStatementHelper:
    SCOPES = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
    ]
    TEMPLATE_DOCUMENT_ID = os.environ.get('GUEST_STATEMENT_TEMPLATE')

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

    def generate_cz_statement(self, reservations, start_date, end_date):
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
        report_document_name = '{}-{}'.format(_('guests_statement'), now.strftime('%d%m%Y%H%M%S'))
        template_copy = self.drive_service.files().copy(fileId=self.TEMPLATE_DOCUMENT_ID,
                                                        body={'name': report_document_name}).execute()
        # Init model
        statement = GuestStatement(
            drive_id=template_copy.get('id'),
            name=report_document_name
        )
        # Replace dates
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_report_dates_requests(start_date, end_date)}).execute()
        # Insert table
        self.docs_service.documents().batchUpdate(documentId=template_copy.get('id'), body={
            'requests': get_table_requests(self.get_document_content(template_copy.get('id')),
                                           len(data) - 1)}).execute()
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
        # Download file
        download_request_pdf = self.drive_service.files().export_media(fileId=template_copy.get('id'),
                                                                       mimeType='application/pdf')
        word_mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        download_request_docx = self.drive_service.files().export_media(fileId=template_copy.get('id'),
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
