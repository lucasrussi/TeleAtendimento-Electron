
const { Schema, model } = require('mongoose')

const newTaksSchema = new Schema({
    //dados do paciente
    title: {
        type: String
    },
    start: {
        type: Date
    },
    end: {
        type: Date
        
    },
    nomeMedico: {
        type: String
        
    },
    rua: {
        type: String
        
    },
    bairro: {
        type: String
        
    },
    cidade: {
        type: String
        
    },
    description: {
        type: String
        
    },
    telefone: {
        type: String
        
    },
    espMedica: {
        type: String
        
    },
    tipoConsulta: {
        type: String
        
    },
    cpf: {
        type: String
        
    },
    //dados dos fornecedores
    nomeFornecedor:{
        type: String
        
    },
    nome_fantasia:{
        type: String
        
    },
    cnpj:{
        type: String
        
    },
    rua_fornecedor:{
        type: String
        
    },
    bairro_fornecedor:{
        type: String
        
    },
    cidade_fornecedor:{
        type: String
        
    },
    telefone_fornecedor:{
        type: String     
    },
    historico_descricao:{
        type:String
    },
    //historico do paciente
    historico_nome:{
        type:String
    },
    historico_prontuario:{
        type:String
    },
    historico_receituario:{
        type:String
    },
    historico_tipoConsulta:{
        type:String 
    },
    historico_data:{
        type:String
    },
  
    //historico de atendimentos, ERP
    atendimento_tipo:{
        type:String
    },
    atendimento_data:{
        type:String
    },
    //variáveis de valor das consultas
    valor_particular:{
        type:Number
    },
    valor_SUS:{
        type:Number
    },
    valor_convenio:{
        type:Number
    },
    //variavel de despesas
    despesas:{
        type:Number
    },
    //variavel de conta
    key:{
        type:String
    },
    account:{
        type:String
    },
    pass:{
        type:String
    },
    statusLogin:{
        type:String
    },
    nomeCadastro:{
        type:String
    },
    tipoAcc:{
        type:String
    },
    emailConta:{
        type:String
    },
    //variaveis da assistente virtual
    loginDoTexto:{
        type:String
    },
    textoAgendamento:{
        type:String
    },
    loginDoLembrete:{
        type:String
    },
    textoLembrete:{
        type:String
    }
})
module.exports = model('task',newTaksSchema)

