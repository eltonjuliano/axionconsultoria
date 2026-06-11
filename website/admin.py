import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('nome', 'empresa', 'email', 'telefone', 'segmento', 'faturamento', 'data_criacao', 'lgpd_consentimento')
    list_filter = ('segmento', 'faturamento', 'data_criacao', 'lgpd_consentimento')
    search_fields = ('nome', 'empresa', 'email', 'telefone', 'mensagem')
    readonly_fields = ('data_criacao',)
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=leads_axion.csv'
        
        # Write UTF-8 BOM for Excel compatibility in Portuguese
        response.write(b'\xef\xbb\xbf')
        
        writer = csv.writer(response, delimiter=';')
        # Human readable headers
        headers = [meta.get_field(f).verbose_name for f in field_names]
        writer.writerow(headers)
        
        for obj in queryset:
            row_data = []
            for field in field_names:
                val = getattr(obj, field)
                # Format boolean
                if isinstance(val, bool):
                    val = "Sim" if val else "Não"
                # Format datetime
                elif hasattr(val, 'strftime'):
                    val = val.strftime('%d/%m/%Y %H:%M:%S')
                row_data.append(val)
            writer.writerow(row_data)

        return response

    export_as_csv.short_description = "Exportar leads selecionados para CSV"
