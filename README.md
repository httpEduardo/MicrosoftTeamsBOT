# First BOT (pt-br)

## Sumário
* [Propósito](#propósito)
* [Dependências](#dependências)
* [Executar](#executar)
* [Contribuição](#contribuição)

## Propósito
Propósito deste projeto é realizar testes de BOTs com a utilização do BotBuilder e Bot Framework da Microsoft.

## Dependências
1. [BotBuilder](https://github.com/Microsoft/BotBuilder);
2. [Bot Framework](https://github.com/Microsoft/BotFramework-Emulator); e
3. [NgRok](https://ngrok.com).

## Executar
1. Iniciar app:  
```
npm start
```
2. Iniciar ngrok, na pasta do .exe:  
```
ngrok http [portaAppLocalhost]
```
3. Abrir Bot Framework com configurações para url disponibilizada pelo ngrok.  

 Ex.: https://1234acbd.ngrok.io/api/messages
