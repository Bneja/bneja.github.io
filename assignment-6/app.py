"""
Flask: Using templates
"""

import random
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, g,flash
import setup_db as set
import os
app = Flask(__name__)
app.secret_key = str(os.urandom(10))
DATABASE = r"./database.db"

def get_db():
    if not hasattr(g, "_database"):
        print("create connection")
        g._database = sqlite3.connect(DATABASE)
    return g._database

@app.teardown_appcontext
def teardown_db(error):
    """Closes the database at the end of the request."""
    db = getattr(g, '_database', None)
    if db is not None:
        print("close connection")
        db.close()



@app.route("/")
def index():    
    # get the database connection
    db=get_db()
    return render_template("index.html", 
                    # get the list of students
                    students=set.select_students(db),
                    courses=set.select_courses(db),)


# Add additional routes here.
@app.route("/student/<student_no>")
def studpage(student_no):
    db=get_db()
    return render_template("student.html",
                           student_no=student_no,
                           name=set.get_name(db,student_no),
                           grades=set.get_grades_by_student(db,student_no))

@app.route("/course/<course_code>")
def coursepage(course_code):
    db=get_db()
    return render_template("course.html",
                           course_code=course_code,
                           grades=set.get_grades_by_course(db,course_code),
                           summary=set.get_course_summary(db,course_code))

@app.route("/add_student")
def add_stud_page():
    return render_template("addstudent.html")

@app.route("/add_student",methods=["POST"])
def add_student():
    db=get_db()
    student=request.form["name"]
    used_student_no=set.select_student_no(db)
    if len(student)>0:
        student_no=random.randint(100000,1000000)
        while student_no in used_student_no:
            student_no=random.randint(100000,1000000)
        
        set.add_student(db,student_no,student)
        return redirect("/")
    else:
        return render_template("addstudent.html",error=True)
    
@app.route("/add_grade",methods=["GET"])
def add_grade_page():
    db=get_db()
    return render_template("addgrade.html",
                           students=set.select_students(db),
                           student=request.args.get("student"),
                           course=request.args.get("course"),
                           courses=set.select_courses(db))

@app.route("/add_grade",methods=["POST"])
def add_grade():
    db=get_db()
    sel_course=request.form.get("course")
    student_no=request.form.get("stud")
    grade=request.form.get("grade")
    if len(sel_course)>0 and len(student_no)>0 and len(grade)>0:
        set.add_grade(db,sel_course,student_no,grade)
        return  render_template("addgrade.html",
                           students=set.select_students(db),
                           student=request.form.get("sel_student"),
                           course=request.form.get("sel_course"),
                           courses=set.select_courses(db),
                           success=True,
                           sel_course=sel_course,
                           student_no=student_no,
                           grade=grade)
    
    return  render_template("addgrade.html",
                           students=set.select_students(db),
                           student=request.form.get("sel_student"),
                           course=request.form.get("sel_course"),
                           courses=set.select_courses(db),
                           error=True)

    

if __name__ == "__main__":
    app.run(debug=True)