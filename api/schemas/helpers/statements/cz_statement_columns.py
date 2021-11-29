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
                            'magnitude': 130,
                            'unit': 'PT'
                        }
                    },
                    'fields': '*'
                }
            })
    return requests
