const inputData = $('Message a model').first().json;
const rawText = inputData.content.parts[0].text;
const jsonString = rawText.replace(/```json\n/g, '').replace(/\n```/g, '');
const data = JSON.parse(jsonString);

return data.noticias.map(item => ({ 
    json: {
        titulo: item.titulo,
        fecha: item.fecha,
        resumen: item.resumen
    } 
}));