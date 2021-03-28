import pymysql

from flask import render_template
from flask import request
from flask import jsonify
from flask import Flask

from webargs import fields
from webargs import validate

from flask_apispec import use_kwargs

app = Flask(__name__,static_folder='static',template_folder='templates')
app.secret_key = "secret key"

db = pymysql.connect(host="localhost",
					port=3306,
					user="root",
					passwd="",
					db="dbCatalogo",
					charset="utf8")
		
@app.route('/add/<string:catalog>', methods=['POST'])
@use_kwargs({
    'description': fields.Str(required=True,validate=[validate.Length(min=4,max=40)])
})
def add(catalog,description):
    try:
		
        if request.method == 'POST':

            cursor = db.cursor(pymysql.cursors.DictCursor)
            sql_show_column = "SELECT NomColCve,NomColDes FROM cCatalogo where NomFisCat = '%s'" % catalog
            cursor.execute(sql_show_column)
            get_columns_catalog = cursor.fetchone()
            
            if_exists_sql = "SELECT EXISTS(SELECT * FROM %s where %s = '%s') as 'existe'" % (catalog,get_columns_catalog['NomColDes'],description,)

            cursor.execute(if_exists_sql)
            
 
            if cursor.fetchone().get("existe") == 1:
                return {
			"msg":f"La descripcion {description} ya existe en {catalog}",
			"register":None
		}
            
            data = (catalog,get_columns_catalog['NomColDes'],description,)
            sql = "INSERT INTO %s (%s) VALUES ('%s')" % data
            
            cursor.execute(sql)
            
            get_register_agregated_sql = "SELECT %s as Clave,%s as Descripcion from %s where %s = %s" % (get_columns_catalog['NomColCve'],get_columns_catalog['NomColDes'],catalog,get_columns_catalog['NomColCve'],cursor.lastrowid)
            
            cursor.execute(get_register_agregated_sql)
            
            get_register_agregated = cursor.fetchone()
            
            return {
                "msg":f"Se agrego {description} correctamente en {catalog}",
                "register": get_register_agregated
            }
            
        else:
            return {"msg":"error al Agregar"}
    except Exception as e:
        return {
            "msg":f"Error {e}"
        }
    finally:
        cursor.close()
    
 		
@app.route('/catalogs')
def get_catalogs():
    try:
        cur = db.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT NomFisCat FROM cCatalogo")
        catalogs = cur.fetchall()
        cur.close()
        return jsonify(catalogs)
    except Exception as e:
        return {"error":"Error al conseguir los catalogos"}
   
@app.route('/catalogs/<string:catalog>',methods=['GET'])
def get_catalogs_registers(catalog):
    try:
        
        cur = db.cursor(pymysql.cursors.DictCursor)

        sql_show_column = "SELECT NomColCve,NomColDes FROM cCatalogo where NomFisCat = %s"
        cur.execute(sql_show_column,catalog)
        get_catalog = cur.fetchone()

        data = (get_catalog['NomColCve'],get_catalog['NomColDes'],catalog)
        sql = "SELECT %s as Clave ,%s as Descripcion FROM %s" % data
        
        cur.execute(sql)
        catalog_registers = cur.fetchall()
        
        cur.close()

        return jsonify(catalog_registers)
    except Exception as e:
        return {"msg":f"Error al conseguir los registros del catalogo {e}"}

  
@app.route('/')
def index():
    return render_template('index.html')
	

if __name__ == "__main__":
    app.run(debug=True)
