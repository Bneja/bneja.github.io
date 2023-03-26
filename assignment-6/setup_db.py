import sqlite3
from sqlite3 import Error

database = r"./database.db"


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn

##### CREATE TABLES ######## 


sql_create_courses_table = """CREATE TABLE IF NOT EXISTS courses (
                                id TEXT UNIQUE NOT NULL,
                                name TEXT
                            );"""

sql_create_students_table = """CREATE TABLE IF NOT EXISTS students (
                                student_no INTEGER UNIQUE NOT NULL,
                                name TEXT NOT NULL
                            );"""

sql_create_grades_table = """CREATE TABLE IF NOT EXISTS grades (
                                id INTEGER PRIMARY KEY,
                                student_no INTEGER NOT NULL,
                                course_id TEXT NOT NULL,
                                grade TEXT NOT NULL,
                                FOREIGN KEY (student_no) REFERENCES students (student_no),
                                FOREIGN KEY (course_id) REFERENCES courses (id)
                            );"""




def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

#### INSERT #########

def add_student(conn, student_no, name):
    """
    Add a new student into the students table
    :param conn:
    :param student_no:
    :param name:
    """
    sql = ''' INSERT INTO students(student_no,name)
              VALUES(?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (student_no, name))
        conn.commit()
    except Error as e:
        print(e)

def init_students(conn):
    init = [(111111,"John Smith"),
            (222222,"Mary Jane"),
            (333333,"Lars Kongen")]
    for s in init:
        add_student(conn, s[0], s[1])

def add_course(conn, id, name):
    """
    Add a new student into the students table
    :param conn:
    :param id:
    :param name:
    """
    sql = ''' INSERT INTO courses(id,name)
              VALUES(?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (id, name))
        conn.commit()
    except Error as e:
        print(e)

def init_courses(conn):
    init = [("MAT100"," Mathematical methods I."),
            ("MAT200"," Mathematical methods II."),
            ("DAT100"," Object-oriented programming"),
            ("DAT200"," Algorithms and data structures"),
            ("DAT220"," Databases"),
            ("DAT310"," Web programming"),
            ("DAT320"," Operating Systems")]
    for c in init:
        add_course(conn, c[0], c[1])

def add_grade(conn, course_id, student_no, grade):
    """
    Add a new student into the students table
    :param conn:
    :param id:
    :param name:
    :return: id
    """
    sql = ''' INSERT INTO grades(student_no,course_id,grade)
              VALUES(?,?,?) '''

    try:
        cur = conn.cursor()
        cur.execute(sql, (student_no, course_id.strip(), grade.strip()))
        conn.commit()
        return True
    except Error as e:
        print(e)
        return False

def init_grades(conn):
    init = [(111111," MAT100", " B"),
            (222222," MAT100", " D"),
            (333333," MAT100", " A"),
            (111111," MAT200", " C"),
            (222222," MAT200", " C"),
            (333333," MAT200", " A"),
            (111111," DAT100", " B"),
            (222222," DAT100", " C"),
            (333333," DAT100", " A"),
            (111111," DAT200", " C"),
            (222222," DAT200", " D"),
            (333333," DAT200", " A"),
            (111111," DAT220", " C"),
            (222222," DAT220", " B"),
            (333333," DAT220", " A"),
            (222222," DAT310", " A"),
            (333333," DAT310", " B"),
            (333333," DAT320", " A")]

    for g in init:
        add_grade(conn,g[1],g[0], g[2])




#### SELECT #######

def select_students(conn):
    cur = conn.cursor()
    cur.execute("SELECT student_no, name FROM students ORDER BY student_no ASC")

    students = []
    for (student_no, name) in cur:
        students.append({ 
            "student_no": student_no, 
            "name": name
            })

    return students

def get_name(conn,student_no):
    cur = conn.cursor()
    cur.execute("SELECT name FROM students WHERE student_no=?",(student_no,))
    return cur.fetchone()[0]

def select_courses(conn):
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM courses ORDER BY id ASC") 

    courses = []
    for (id,name) in cur:
        courses.append({ 
            "course_id": id, 
            "name": name
            })

    return courses

def select_grades(conn):
    cur = conn.cursor()
    cur.execute("SELECT student_no, course_id, grade FROM grades")

    grades = []
    for (nr,id,grade) in cur:
        grades.append({ 
            "student_no": nr,
            "course_id": id, 
            "grade": grade
            })

    return grades

def get_grades_by_student(conn,student_no):
    cur = conn.cursor()
    cur.execute("SELECT course_id,grade FROM grades WHERE student_no=? ORDER BY grade ASC",(student_no,))
    grades = []
    for (id,grade) in cur:
        grades.append({ 
            "course_id": id, 
            "grade": grade
            })
    return grades

def get_grades_by_course(conn,course_code):
    cur = conn.cursor()
    cur.execute("SELECT student_no,grade FROM grades WHERE course_id=? ORDER BY grade ASC",(course_code,))
    grades = []
    for (student_no,grade) in cur:
        grades.append({ 
            "student_no": student_no, 
            "grade": grade
            })
    return grades

def get_course_summary(conn,course_code):
    cur = conn.cursor()
    cur.execute("SELECT grade,COUNT(grade) FROM grades WHERE course_id=? GROUP BY grade ORDER BY grade",(course_code,))
    summary = []
    for (grade,count) in cur:
        summary.append({ 
            "grade": grade,
            "count": count
            })
    return summary

def select_student_no(conn):
    cur=conn.cursor()
    cur.execute("SELECT student_no FROM students")
    student_no_list=[]
    for student_no in cur:
        student_no_list.append(student_no)
    return student_no_list
#### SETUP ####

def setup():
    conn = create_connection(database)
    if conn is not None:
        create_table(conn, sql_create_courses_table)
        create_table(conn, sql_create_students_table)
        create_table(conn, sql_create_grades_table)
        init_students(conn)
        init_courses(conn)
        init_grades(conn)

        print(select_courses(conn))

        conn.close()
if __name__ == '__main__':
    # If executed as main, this will create tables and insert initial data
    setup()