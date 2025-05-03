import sqlite3
import bcrypt
import speech_recognition as sr
import base64

################### [Conexión a la base de datos de Usuarios/Señas] #################################3333

def Conectar():
    conn = sqlite3.connect('BaseUs.db')
    return conn


######################################[Funciones del login]########################################################################3


def RegistrarUsuario(Nombre, Apellido, Correo, Usuario, Password):
    Hashed = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())  # Hashea la contraseña

    conn = Conectar()
    cursor = conn.cursor()

    query = "INSERT INTO Usuarios (Username, Password, Nombre, Apellido, Correo) VALUES (?, ?, ?, ?, ?)"
    cursor.execute(query, (Usuario, Hashed, Nombre, Apellido, Correo))  # 

    conn.commit()

    cursor.close()
    conn.close()

def ComprobarUsuario(Usuario, Password):
    conn = Conectar()
    cursor = conn.cursor()

    # Seleccionar la contraseña almacenada en la base de datos
    cursor.execute("SELECT Password FROM Usuarios WHERE Username = ?", (Usuario,))
    PasswordGuardada = cursor.fetchone()

    # Verificar si la contraseña existe y coincide
    if PasswordGuardada:
        
        if bcrypt.checkpw(Password.encode('utf-8'), PasswordGuardada[0]):
            conn.close()
            return {'success': True, 'redirect': '/convertidor'}
    
    conn.close()
    return {'success': False, 'message': 'Usuario o contraseña incorrectos'}


########################[Funcion de reconocimiento de voz]#####################################################################


def reconocer_voz(): # Quitar los comentarios para comprobar. Necesita un while true Variable = reconocer_voz()
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Di algo")
        audio = r.listen(source) 
        
    try:
        texto = r.recognize_google(audio, language="es-ES")
        print(f"Has dicho: {texto}") 
        return texto
    except sr.UnknownValueError:  
        print("No se pudo entender lo que dijiste")
        return ""
    except sr.RequestError as e:
        print(f"Error extraño {e}")
        return ""

######################### [Funciones de la aplicacion] #####################################################3

def VozAImagen(palabra):
    conn = Conectar()
    cursor = conn.cursor()
    cursor.execute('SELECT Imagen FROM Señas WHERE Palabra = ?', (palabra,))
    Imagen = cursor.fetchone()
    conn.close()
    
    # Verifica si hay resultado y convierte el blob a Base64
    if Imagen and Imagen[0]:
        imagen_base64 = base64.b64encode(Imagen[0]).decode('utf-8')
        return f"data:image/jpeg;base64,{imagen_base64}"  # Cambia el tipo de imagen si no es JPEG
    return None

#################################

def InsertarImagen(Nombre, Ruta):
    conn = Conectar()
    cursor = conn.cursor()
    
    # Inserta el nombre y la imagen (convertida a binario)
    query = 'INSERT INTO Señas (Nombre, Ruta) VALUES (?, ?)'
    cursor.execute(query, (Nombre, Ruta))
    
    conn.commit()  
    conn.close()   


#############################################
def convertir_a_binario(foto):
    with open(foto, 'rb') as f:
        blob = f.read()
    return blob  

###############################################
def CompararImagen(Frase):
    conn = Conectar()
    cursor = conn.cursor()
    FraseMinuscula = Frase.lower()
    FraseSeparada = FraseMinuscula.split()
    imagenes = []  # Lista para almacenar las rutas de imágenes

    for palabra in FraseSeparada:
        cursor.execute('SELECT Ruta FROM Señas WHERE Nombre = ?', (palabra,))
        resultado = cursor.fetchone()

        if resultado:
            Ruta = resultado[0]
            imagenes.append(f"/static/images/{Ruta}")  # Aquí se agrega /static/images/ al resultado
        else:
            imagenes.append("/static/images/default.webp")  # Imagen por defecto si no se encuentra la palabra
    conn.close()
    return imagenes


#InsertarImagen('okay', 'okay.png')
