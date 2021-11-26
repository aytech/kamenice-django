class GuestReportHelper:
    @staticmethod
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

    @staticmethod
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

    @staticmethod
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

    @staticmethod
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

    @staticmethod
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
