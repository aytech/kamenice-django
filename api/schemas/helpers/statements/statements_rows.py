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
                        if str(data[row][cell]) != '':
                            requests.append({
                                'insertText': {
                                    'location': {
                                        'index': cells[cell].get('content')[0].get('startIndex')
                                    },
                                    'text': str(data[row][cell])
                                }
                            })
    return requests
