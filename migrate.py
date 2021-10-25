import sqlite3


def migrate_suites(source, destination, connection):
    suites_select = 'SELECT * FROM api_suite;'
    source.execute(suites_select)
    for suite in source.fetchall():
        insert_query = '''
                    INSERT INTO api_suite (
                        id, title, number, number_beds, price_base, created, updated, deleted, number_beds_extra)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                '''
        destination.execute(insert_query, suite)
        connection.commit()
        print('Suite {} created'.format(suite[1]))


def migrate_suite_discounts(source, destination, connection):
    suites_discounts_select = 'SELECT * FROM api_discount_suite;'
    source.execute(suites_discounts_select)
    for suite_discount in source.fetchall():
        insert_query = '''
                        INSERT INTO api_discount_suite (id, created, deleted, type, value, updated, suite_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    '''
        destination.execute(insert_query, suite_discount)
        connection.commit()
        print('Suite discount {} created'.format(suite_discount[3]))


def migrate_guests(source, destination, connection):
    guests_query = 'SELECT * FROM api_guest;'
    source.execute(guests_query)
    for guest in source.fetchall():
        insert_query = '''
            INSERT INTO api_guest (
                id, address_municipality, address_psc, address_street, citizenship, email, gender, identity, name,
                phone_number, surname, visa_number, created, updated, deleted, age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        destination.execute(insert_query, guest)
        connection.commit()
        print('Guest {} {} created'.format(guest[8], guest[10]))


def migrate_reservations(source, destination, connection):
    reservations_query = 'SELECT * FROM api_reservation;'
    source.execute(reservations_query)
    for reservation in source.fetchall():
        insert_query = '''
            INSERT INTO api_reservation (
                id, created, deleted, expired, from_date, hash, meal, notes, price_accommodation, price_meal, 
                price_municipality, price_total, purpose, to_date, type, updated, guest_id, paying_guest_id, suite_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        '''
        destination.execute(insert_query, reservation)
        connection.commit()
        print('Reservation {} created'.format(reservation[5]))


def migrate_reservation_roommates(source, destination, connection):
    roommates_query = 'SELECT * FROM api_reservation_roommates;'
    source.execute(roommates_query)
    for roommate in source.fetchall():
        insert_query = '''
            INSERT INTO api_reservation_roommates (id, reservation_id, guest_id)
            VALUES (?, ?, ?)
        '''
        destination.execute(insert_query, roommate)
        connection.commit()
        print('Roommate {} created'.format(roommate[0]))


source_db_name = 'db_source.sqlite3'  # replace with command line argument
destination_db_name = 'db.sqlite3'  # replace with command line argument
connection_source = None
connection_destination = None

try:
    connection_source = sqlite3.connect(source_db_name)
    cursor_source = connection_source.cursor()
    print('Connected to source DB {}'.format(source_db_name))

    connection_destination = sqlite3.connect(destination_db_name)
    cursor_destination = connection_destination.cursor()
    print('Connected to source DB {}'.format(destination_db_name))

    migrate_suites(cursor_source, cursor_destination, connection_destination)
    migrate_suite_discounts(cursor_source, cursor_destination, connection_destination)
    migrate_guests(cursor_source, cursor_destination, connection_destination)
    migrate_reservations(cursor_source, cursor_destination, connection_destination)
    migrate_reservation_roommates(cursor_source, cursor_destination, connection_destination)

    cursor_source.close()
    cursor_destination.close()

except sqlite3.Error as error:
    print('Cannot connect, reason: {}'.format(error))
finally:
    if connection_source is not None:
        connection_source.close()
        print('Connection to source DB {} closed'.format(source_db_name))
    if connection_destination is not None:
        connection_destination.close()
        print('Connection to destination DB {} closed'.format(destination_db_name))
