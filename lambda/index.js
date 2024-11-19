/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Randomized Wellness! You can set a reminder, start a wellness activity, check your streak, or ask for a wellness boost. What would you like to do?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Intent 1: SetReminderIntent (uses slots)
const SetReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetReminderIntent';
    },
    handle(handlerInput) {
        const timeSlot = handlerInput.requestEnvelope.request.intent.slots.Time.value;
        
        if (timeSlot) {
            const speakOutput = `Okay, I have set a reminder for a wellness activity at ${timeSlot}.`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            const speakOutput = 'I need to know the time for your reminder. Please tell me the time you want me to set the reminder for.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('What time should I set the reminder for?')
                .getResponse();
        }
    }
};

// Intent 2: StartWellnessActivityIntent
const StartWellnessActivityIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartWellnessActivityIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Let’s start a wellness activity! Try doing 5 minutes of deep breathing or a quick stretch.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Intent 3: CheckWellnessStreakIntent
const CheckWellnessStreakIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckWellnessStreakIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You have completed your wellness activities for 3 days in a row. Great job keeping it up!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Intent 4: WellnessBoostIntent
const WellnessBoostIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WellnessBoostIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Feeling tired? Here’s a quick boost: try doing 10 jumping jacks or a brief meditation session to regain energy.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can set a reminder, start a wellness activity, check your streak, or ask for a wellness boost. How can I assist you?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetReminderIntentHandler,  // Intent with slots
        StartWellnessActivityIntentHandler,  // Intent 2
        CheckWellnessStreakIntentHandler,  // Intent 3
        WellnessBoostIntentHandler,  // Intent 4
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .create();

const adapter = new ExpressAdapter(skill, false, false);
const app = express();

// app.use(express.static('public'));
app.get('/', (req, res) => { res.send('<html><head><title>Title</title></head><body>This is a test.</body></html>') });
app.post('/', adapter.getRequestHandlers());
app.listen(3040);
