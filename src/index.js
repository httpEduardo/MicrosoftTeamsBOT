const builder = require("botbuilder");
const restify = require("restify");
const githubClient = require('./github-client');

const connector = new builder.ChatConnector();

const bot = new builder.UniversalBot(connector)
    .set('storage', new builder.MemoryBotStorage());

const dialog = new builder.IntentDialog();

dialog.matches(/^search/i, [
    
    function (session, args, next) {

        if(session.message.text.toLowerCase() === 'search') {
            builder.Prompts.text(session, 'Olá, o que você procura?');
        } else {
            var query = session.message.text.substring(7);
            next({response: query});
        }
    },

    function (session, result, next) {

        var query = result.response;
        if (!query) {
            session.endDialog('Conversa cancelada.');
        } else {
            githubClient.executeSearch(query, function (profiles) {
                var totalCount = profiles.total_count;

                if (totalCount === 0) {
                    session.endDialog('Desculpe, não encontrei resultados para sua pesquisa.');
                } else if (totalCount > 10) {
                    session.endDialog('Desculpe, encontrei muitos resultados, poderia me informar algo mais específico?');
                } else {
                    session.dialogData.property = null;
                    var usernames = profiles.items.map(function (item) { return item.login });
                    builder.Prompts.choice(session, 'Me informe o Id do usuário que gostaria de carregar?\n', usernames);
                }
            });
        }        
    },

    function (session, result, next) {
        var username = result.response.entity;
        githubClient.loadProfile(username, function (profile) {
            var card = new builder.ThumbnailCard(session);
            card.title(profile.login);
            card.images([builder.CardImage.create(session, profile.avatar_url)]);
            if (profile.name) card.subtitle(profile.name);

            var text = '';
            if (profile.company) text += profile.company + '\n';
            if (profile.email) text += profile.email + '\n';
            if (profile.bio) text += profile.bio;
            card.text(text);

            card.tap(new builder.CardAction.openUrl(session, profile.html_url));
            
            var message = new builder.Message(session).attachments([card]);
            session.send(message);
        });
    }
]);

bot.dialog('/', dialog);

const server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(3978);