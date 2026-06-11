from django.test import TestCase, Client
from django.urls import reverse
from .models import Lead
import json

class WebsiteTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.home_url = reverse('website:home')
        self.submit_url = reverse('website:submit_lead')
        self.privacy_url = reverse('website:privacy_policy')

    def test_landing_page_loads(self):
        """Ensures that the landing page renders successfully."""
        response = self.client.get(self.home_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Axion Consultoria')
        self.assertContains(response, 'Descubra quanto sua empresa')

    def test_privacy_policy_page_loads(self):
        """Ensures that the privacy policy page renders successfully."""
        response = self.client.get(self.privacy_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Política de Privacidade')

    def test_lead_submission_valid(self):
        """Test submitting a valid lead via AJAX POST."""
        payload = {
            'nome': 'João da Silva',
            'empresa': 'Silva & Cia Ltda',
            'telefone': '(41) 99999-9999',
            'email': 'joao@silvacia.com.br',
            'segmento': 'Comércio / Varejo',
            'faturamento': 'De R$ 100.000 a R$ 300.000 / mês',
            'mensagem': 'Gostaria de agendar o diagnóstico.',
            'lgpd_consentimento': True
        }
        
        response = self.client.post(
            self.submit_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        
        # Verify saved in DB
        self.assertEqual(Lead.objects.count(), 1)
        lead = Lead.objects.first()
        self.assertEqual(lead.nome, 'João da Silva')
        self.assertEqual(lead.empresa, 'Silva & Cia Ltda')
        self.assertTrue(lead.lgpd_consentimento)

    def test_lead_submission_invalid(self):
        """Test submitting invalid lead details (e.g. missing fields, email format)."""
        payload = {
            'nome': '', # Missing name
            'empresa': 'Silva & Cia Ltda',
            'telefone': '', # Missing phone
            'email': 'joaosilvacia.com.br', # Invalid email
            'segmento': 'Comércio / Varejo',
            'faturamento': 'De R$ 100.000 a R$ 300.000 / mês',
            'mensagem': '',
            'lgpd_consentimento': False # Denied LGPD
        }
        
        response = self.client.post(
            self.submit_url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data['status'], 'error')
        self.assertIn('nome', data['errors'])
        self.assertIn('telefone', data['errors'])
        self.assertIn('email', data['errors'])
        self.assertIn('lgpd_consentimento', data['errors'])
        
        # Verify NOT saved in DB
        self.assertEqual(Lead.objects.count(), 0)
