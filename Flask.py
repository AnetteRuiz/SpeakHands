from flask import Flask, render_template, request, jsonify, redirect, url_for
from Funciones import *  # Asegúrate de que comprobar_usuario esté implementada

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('Index.html')  # Renderiza la plantilla index.html



@app.route('/register', methods=['POST'])
def register():
    # Obtén los datos del formulario
    nombre = request.form.get('new-name')
    apellido = request.form.get('new-apellido')
    correo = request.form.get('new-email')
    usuario = request.form.get('new-username')
    password = request.form.get('new-password')
    

    # Llama a la función para registrar al usuario
    try:
        RegistrarUsuario(nombre, apellido, correo, usuario, password)
        return jsonify({'success': True})  # Responde con éxito
    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        return jsonify({'success': False})  # Responde con error

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if ComprobarUsuario(username, password):
        return jsonify(success=True, redirect_url=url_for('convertidor'))  # Redirigir al convertidor
    else:
        return jsonify(success=False), 400

@app.route('/convertidor', methods=['GET','POST'])
def convertidor():
    return render_template('convertidor.html')  # Asegúrate de que esta plantilla existe

@app.route('/Avatar')
def avatar():
    return render_template('Avatar.html')

@app.route('/Learn', methods=['GET','POST'])
def Learn():
    return render_template('Learn.html')

@app.route('/Restaurantes',methods=['GET','POST'])
def Restaurantes():
    return render_template('Restaurantes.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    phrase = data.get('phrase', '').lower()

    # Llamar a CompararImagen para obtener las rutas de las imágenes asociadas
    image_urls = CompararImagen(phrase)

    # Responder con las rutas de las imágenes
    return jsonify({'images': image_urls})



if __name__ == '__main__':
    app.run(debug=True)