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

@app.route("/year")
def year():
    """Return a list of years."""
    
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query(stmt, db.session.bind, coerce_float=False)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns)[3:])

@app.route("/department")
def department():
    """Return a list of departments."""
    
    # Use Pandas to perform the sql query
    stmt = db.session.query(oc_salary_db).statement
    df = pd.read_sql_query("select department from oc_salary group by department", db.session.bind, coerce_float=False)

    # Return a list of the column names (sample names)
    return jsonify(list(df["department"].values))

if __name__ == "__main__":
    app.run(debug=True)