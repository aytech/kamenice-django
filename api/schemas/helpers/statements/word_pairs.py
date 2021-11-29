def get_formatted_pair(first, second, format_string):
    if first is not None:
        if second is None:
            return first
        else:
            return format_string.format(first, second)
    return '-'
