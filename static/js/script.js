document.getElementById('signature-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const emailValue = emailField.value.trim();
    const emailPattern = /^[a-zA-Z]+\.[a-zA-Z]+@gmf\.fortaleza\.ce\.gov\.br$/;

    if (!emailPattern.test(emailValue)) {
        alert('Por favor, insira um email válido no formato nome.sobrenome@gmf.fortaleza.ce.gov.br');
        return;
    }

    const formData = new FormData(event.target);
    const response = await fetch('/generate-signature', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        const signatureImage = document.getElementById('signature-image');
        const downloadLink = document.getElementById('download-link');

        signatureImage.src = result.imageUrl;
        downloadLink.href = result.imageUrl;

        document.getElementById('result').style.display = 'block';
    } else {
        alert('Erro ao gerar assinatura. Tente novamente.');
    }
});

// VALIDAÇÃO DE FORMULÁRIO

$(document).ready(function() {
    $('#phone').mask('(00) 00000-0000');

    $('#name').on('input', function() {
        const fullName = $(this).val().trim().split(' ');
        if (fullName.length > 1) {
            const firstName = fullName[0];
            const lastName = fullName[fullName.length - 1];
            $('#email').val(firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@gmf.fortaleza.ce.gov.br');
        } else {
            $('#email').val('');
        }
    });

    $('#download-link').on('click', function(event) {
        const signatureImage = $('#signature-image').attr('src');
        if (!signatureImage) {
            event.preventDefault();
            alert('Por favor, gere a assinatura antes de tentar baixar.');
        }
    });

    // Validar campos de nome e email para aceitar somente letras
    $('#name, #email').on('keypress', function(event) {
        const regex = /^[a-zA-Z\s]+$/;
        const key = String.fromCharCode(event.which);
        if (!regex.test(key)) {
            event.preventDefault();
        }
    });
});