

def asm_context(request):
    context_data = dict()
    context_data['current_url'] = request.build_absolute_uri()

    return context_data
