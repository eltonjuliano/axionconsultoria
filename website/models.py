from django.db import models

class Lead(models.Model):
    nome = models.CharField(max_length=150, verbose_name="Nome Completo")
    empresa = models.CharField(max_length=150, verbose_name="Empresa")
    telefone = models.CharField(max_length=20, verbose_name="Telefone / WhatsApp")
    whatsapp = models.BooleanField(default=True, verbose_name="É WhatsApp?")
    email = models.EmailField(verbose_name="E-mail")
    segmento = models.CharField(max_length=100, verbose_name="Segmento")
    faturamento = models.CharField(max_length=100, verbose_name="Faturamento Aproximado")
    mensagem = models.TextField(blank=True, null=True, verbose_name="Mensagem")
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Envio")
    lgpd_consentimento = models.BooleanField(default=False, verbose_name="Consentimento LGPD")

    class Meta:
        verbose_name = "Lead"
        verbose_name_plural = "Leads"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.nome} - {self.empresa} ({self.data_criacao.strftime('%d/%m/%Y')})"
