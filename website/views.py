from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Lead
import json

@ensure_csrf_cookie
def home(request):
    """
    Renders the main institutional landing page for Axion Consultoria.
    Also handles standard (non-JS fallback) lead form POST submissions.
    """
    context = {
        'segmentos': [
            'Comércio / Varejo',
            'Indústria / Manufatura',
            'Prestação de Serviços',
            'Tecnologia / SaaS',
            'Franquias',
            'Saúde e Bem-estar',
            'Construção Civil / Imobiliário',
            'Agronegócio',
            'Outros'
        ],
        'faturamentos': [
            'Até R$ 50.000 / mês',
            'De R$ 50.000 a R$ 100.000 / mês',
            'De R$ 100.000 a R$ 300.000 / mês',
            'De R$ 300.000 a R$ 500.000 / mês',
            'De R$ 500.000 a R$ 1.000.000 / mês',
            'Acima de R$ 1.000.000 / mês'
        ]
    }
    return render(request, 'index.html', context)

@require_POST
def submit_lead(request):
    """
    Handles AJAX POST requests to submit new business leads.
    Performs server-side validation and returns JSON response.
    """
    try:
        # Check content type for AJAX submissions
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        nome = data.get('nome', '').strip()
        empresa = data.get('empresa', '').strip()
        telefone = data.get('telefone', '').strip()
        email = data.get('email', '').strip()
        segmento = data.get('segmento', '').strip()
        faturamento = data.get('faturamento', '').strip()
        mensagem = data.get('mensagem', '').strip()
        lgpd = data.get('lgpd_consentimento')

        # Translate LGPD consent from different possible formats
        lgpd_bool = False
        if lgpd in [True, 'on', 'true', '1', 1]:
            lgpd_bool = True

        # Validation checks
        errors = {}
        if not nome:
            errors['nome'] = 'O nome completo é obrigatório.'
        if not empresa:
            errors['empresa'] = 'O nome da empresa é obrigatório.'
        if not telefone:
            errors['telefone'] = 'O telefone / WhatsApp é obrigatório.'
        if not email:
            errors['email'] = 'O e-mail é obrigatório.'
        elif '@' not in email:
            errors['email'] = 'Insira um e-mail válido.'
        if not segmento:
            errors['segmento'] = 'Selecione o segmento da sua empresa.'
        if not faturamento:
            errors['faturamento'] = 'Selecione a faixa de faturamento.'
        if not lgpd_bool:
            errors['lgpd_consentimento'] = 'Você precisa aceitar os termos de privacidade (LGPD).'

        if errors:
            return JsonResponse({'status': 'error', 'errors': errors}, status=400)

        # Create the lead
        lead = Lead.objects.create(
            nome=nome,
            empresa=empresa,
            telefone=telefone,
            email=email,
            segmento=segmento,
            faturamento=faturamento,
            mensagem=mensagem,
            lgpd_consentimento=lgpd_bool
        )

        return JsonResponse({
            'status': 'success',
            'message': 'Recebemos sua solicitação. Nossa equipe entrará em contato em breve.'
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Ocorreu um erro ao processar sua solicitação: {str(e)}'
        }, status=500)

def privacy_policy(request):
    """
    Renders the LGPD-compliant privacy policy page.
    """
    return render(request, 'privacy_policy.html')
