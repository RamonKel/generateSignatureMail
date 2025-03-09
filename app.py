from flask import Flask, request, jsonify, send_file
from PIL import Image, ImageDraw, ImageFont
import io
import os
import time

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/generate-signature', methods=['POST'])
def generate_signature():
    full_name = request.form['full_name']
    role = request.form['role'].upper()
    assignment = request.form['assignment'].upper()
    department = request.form['department'].upper()
    email = request.form['email'].lower()
    phone = request.form['phone']

    name_parts = full_name.split()
    if len(name_parts) > 1:
        first_name = name_parts[0]
        last_name = name_parts[-1]
        name = f"{first_name} {last_name}".upper()
    else:
        name = full_name.upper()

    try:
        # Carregar a imagem modelo
        image = Image.open('static/img/modelo.jpeg')
        draw = ImageDraw.Draw(image)

        # Carregar as fontes e tamanhos
        font_path = os.path.join('static', 'fonts', 'AtkinsonHyperlegibleNext-SemiBold.ttf')
        fontName = ImageFont.truetype(font_path, 21)
        fontRole = ImageFont.truetype(font_path, 21)
        fontDepartament = ImageFont.truetype(font_path, 13)
        fontMail = ImageFont.truetype(font_path, 15)
        fontPhone = ImageFont.truetype(font_path, 14)
        fontAssignment = ImageFont.truetype(font_path, 16)

        # Inserir os dados na imagem
        if role == 'GD':
            draw.text((57, 30), name, font=fontName, fill="white")
        elif role == 'SUB':
            draw.text((73, 30), name, font=fontName, fill="white")
        elif role == 'INSP':
            draw.text((83, 30), name, font=fontName, fill="white")
        elif role == 'ESTG':
            draw.text((84, 30), name, font=fontName, fill="white")
        
        draw.text((21, 30), role, font=fontRole, fill="white")
        draw.text((21, 74), department, font=fontDepartament, fill="white")
        draw.text((21, 96), email, font=fontMail, fill="white")
        draw.text((21, 115), phone, font=fontPhone, fill="white")
        draw.text((21, 55), assignment, font=fontAssignment, fill="white")

        # Salvar a imagem em um buffer de bytes
        img_bytes = io.BytesIO()
        image.save(img_bytes, format='JPEG')
        img_bytes.seek(0)

        # Retornar a URL da imagem gerada
        timestamp = int(time.time())
        image_url = os.path.join('static', 'signature.jpeg')
        with open(image_url, 'wb') as f:
            f.write(img_bytes.getbuffer())

        return jsonify({'imageUrl': f'/{image_url}?t={timestamp}'})
    except Exception as e:
        print(e)
        return 'Erro ao gerar assinatura.', 500

if __name__ == '__main__':
    app.run(debug=True)