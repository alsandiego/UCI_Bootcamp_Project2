import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/oc_salary_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
oc_salary_db = Base.classes.oc_salary

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/page2")
def index2():
    """Return the homepage."""
    return render_template("page2.html")
    
@app.route("/year")
def year():
    """Return a list of years."""
    
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind, coerce_float=False)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns)[3:])

# shows the department salary total for selected year
@app.route("/year/<year>")
def year_dept_total(year):
    """Return department total for selected year"""
    
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind)


    # sample_data = df.loc[(df[year] > 0), ["department", year]]
    groupby_sum = df.groupby(["department"])[year].sum().reset_index()

    # Sort by sample
    groupby_sum.sort_values(by="department", ascending=True, inplace=True)

    # Format the data to send as json
    data = {
        "department": groupby_sum.department.tolist(),
        "total_salary": groupby_sum[year].values.tolist(),
    }
    return jsonify(data)

# shows salary and position for selected year and department
@app.route("/<yr>/<dept>")
def year_dept(yr, dept):
    """Return department salary for year selected."""
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    # print(dept.upper())
    dept_total = df.loc[(df[yr] >0) & (df["department"] == dept.upper()), [dept, "position", yr]]
    # Format the data to send as json
    data = {
        "salary": dept_total[yr].values.tolist(),
        "position": dept_total.position.tolist()
    }
    return jsonify(data)

@app.route("/department")
def department():
    """Return a list of departments."""
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query("select department from oc_salary group by department", db.session.bind, coerce_float=False)

    # Return a list of the column names (sample names)
    return jsonify(list(df["department"].values))

@app.route("/department/<year>")
def dept(year):
    """Return department, position."""
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1

    # sample_data = df.loc[(df[year] >0) & (df["department"]== "ACCOUNTING"), ["department", "position", year]]

    sample_data = df.loc[(df[year] >0), ["position", year]]

    # Sort by sample
    sample_data.sort_values(by="position", ascending=True, inplace=True)

    # Format the data to send as json
    data = {
        "position": sample_data.position.tolist(),
        "salary": sample_data[year].values.tolist()
    }
    return jsonify(data)

@app.route("/position/<year>")
def position(year):
    """Return department, position."""
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1

    # sample_data = df.loc[(df[year] >0) & (df["department"]== "ACCOUNTING"), ["department", "position", year]]

    sample_data = df.loc[(df[year] >0), ["department", "position", year]]

    # Sort by sample
    sample_data.sort_values(by="department", ascending=True, inplace=True)

    # Format the data to send as json
    data = {
        "department": sample_data.department.values.tolist(),
        "salary": sample_data[year].values.tolist(),
        "position": sample_data.position.tolist(),
    }
    return jsonify(data)

# shows salary for selected department and position
@app.route("/bubble/<department>/<position>")
def bubblechart(department, position):
    """Return all salary for dept and position selected."""
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    # print(dept.upper())
    dept_total = df.loc[(df["department"] == department.upper()) & (df["position"] == position.upper()), [department, position, "2014","2015","2016","2017","2018"]]
    # Format the data to send as json
    data = {
        "2014": dept_total["2014"].tolist(),
        "2015": dept_total["2015"].tolist(),
        "2016": dept_total["2016"].tolist(),
        "2017": dept_total["2017"].tolist(),
        "2018": dept_total["2018"].tolist()
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)