import sqlite3
from sqlite3 import Error


def migrate(source, destination, connection):
    query = """
        SELECT reservation.from_date, reservation.to_date, roommate.guest_id, roommate.reservation_id 
        FROM 'api_reservation_roommates' AS roommate
        INNER JOIN 'api_reservation' AS reservation ON roommate.reservation_id = reservation.id;
    """
    source.execute(query)
    for roommate in source.fetchall():
        insert_query = """
            INSERT INTO api_roommate (from_date, to_date, entity_id, reservation_id)
            VALUES (?, ?, ?, ?)
        """
        try:
            destination.execute(insert_query, roommate)
            connection.commit()
            print('Roommate {} created'.format(roommate[2]))
        except Error as e:
            print('Cannot migrate roommate, reason: {}'.format(e))


source_db_name = "db_source.sqlite3"
destination_db_name = 'db.sqlite3'
connection_source = None
connection_destination = None

try:
    print('')
    connection_source = sqlite3.connect(source_db_name)
    cursor_source = connection_source.cursor()
    print('Connected to source DB {}'.format(source_db_name))

    connection_destination = sqlite3.connect(destination_db_name)
    cursor_destination = connection_destination.cursor()
    print('Connected to source DB {}'.format(destination_db_name))
    print('')

    migrate(cursor_source, cursor_destination, connection_destination)

except sqlite3.Error as error:
    print('Cannot connect, reason: {}'.format(error))
finally:
    print('')
    if connection_source is not None:
        connection_source.close()
        print('Connection to source DB {} closed'.format(source_db_name))
    if connection_destination is not None:
        connection_destination.close()
        print('Connection to destination DB {} closed'.format(destination_db_name))
    print('')
