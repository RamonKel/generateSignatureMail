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
    $('#phone-secondary').mask('0000-0000');

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

     // Mapeamento dos setores para os números pré-definidos
     const sectorNumbers = {
        "Arquivo/GMF": "2028-4200",
        "Armaria/GMF": "2028-0545",
        "Asjur/GMF": "2028-0554",
        "Asplan/GMF": "2028-0538",
        "Cegea/GMF": "2028-0539",
        "Cegef/GMF": "2028-0540",
        "Cegepe/GMF": "2028-4203",
        'Coafi/GMF': '2028-0542',
        "Cetic/GMF": "2028-0544",
        "Coesp/GMF": "2028-0557",
        "Iterm/GMF": "2180-0687",
        "Compras/GMF": "2028-0541",
        "Copcom/GMF": "2028-0558",
        "Gemp/GMF": "2028-4201",
        "Gtam/GMF": "2180-0684",
        "Iciclo/GMF": "2180-665",
        "Direção Adjunta/GMF": "2028-0551",
        "Direção Geral/GMF": "2028-0553",
        "Nuplan/GMF": "2028-0550",
        "ISA/GMF": "2018-0266",
        "Nucoint/GMF": "2028-4204",
        "Nucont/GMF": "2028-0543",
        "Patrimônio/GMF": "2028-0555",
        "Ipam/GMF": "2018-0259",
        "Protocolo/GMF": "2028-0548",
    };

    // Função para preencher o número secundário com base no setor selecionado
    function fillSecondaryPhone() {
        const department = document.getElementById('department').value;
        const phoneSecondary = document.getElementById('phone-secondary');
        if (sectorNumbers[department]) {
            phoneSecondary.value = sectorNumbers[department];
        } else {
            phoneSecondary.value = '';
        }
    }

    // Adicionar o evento de mudança ao campo de seleção do setor
    document.getElementById('department').addEventListener('change', fillSecondaryPhone);

    // Validar campos de nome e email para aceitar somente letras
    $('#email').on('keypress', function(event) {
        const regex = /^[a-zA-Z\s.@]+$/; // Adicionando o ponto e o @ na expressão regular
        const key = String.fromCharCode(event.which);
        if (!regex.test(key)) {
            event.preventDefault();
        }
    });

    $('#name').on('keypress', function(event) {
        const regex = /^[a-zA-Z\s]+$/;
        const key = String.fromCharCode(event.which);
        if (!regex.test(key)) {
            event.preventDefault();
        }
    });
});