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
