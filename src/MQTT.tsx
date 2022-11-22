import mqtt from 'mqtt';
import { IClientOptions } from 'mqtt/types/lib/client-options';

/*
user = "grupo2-bancadaA4"
passwd = "L@Bdygy2A4"

Broker = "labdigi.wiseful.com.br"
Port = 80
KeepAlive = 60
*/
const urlBroker = 'labdigi.wiseful.com.br';
const username = 'grupo2-bancadaA4';

const options: IClientOptions = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Auth
    username,
    password: 'L@Bdygy2A4',
};

/* ANTES
client = mqtt.Client()              
client.on_connect = on_connect      
client.on_message = on_message  

client.username_pw_set(user, passwd)


print("=================================================")
print("Teste Cliente MQTT")
print("=================================================")

client.connect(Broker, Port, KeepAlive)

client.loop_start() 

# A primeira mensagem costuma ser perdida aqui no notebook
client.publish(user+"/S0", payload="0", qos=0, retain=False)



*/

const client = mqtt.connect(urlBroker, options);

client.on('connect', () => onConnect());
client.on('message', (topic, message) => onMessage(topic, message));

/*  ANTES
# Quando conectar na rede (Callback de conexao)
def on_connect(client, userdata, flags, rc):
    print("Conectado com codigo " + str(rc))
    client.subscribe(user+"/E6", qos=0) # Botão 3
    client.subscribe(user+"/E5", qos=0) # Botão 2
    client.subscribe(user+"/E4", qos=0) # Botão 1
    client.subscribe(user+"/E3", qos=0) # Botão 0
    client.subscribe(user+"/E2", qos=0) # Iniciar
    client.subscribe(user+"/S4", qos=0)
    client.subscribe(user+"/S3", qos=0)
    client.subscribe(user+"/S2", qos=0)
    client.subscribe(user+"/S1", qos=0)
    client.subscribe(user+"/S0", qos=0)
    client.subscribe(user+"/TX", qos=0)
*/

const onConnect = () => {
    console.log('Connected');
    client.subscribe('test', (err) => {
        if (!err) client.publish('test', 'Hello mqtt');
    });
};

/*  ANTES
# Quando receber uma mensagem (Callback de mensagem)
def on_message(client, userdata, msg):
    print(str(msg.topic)+" "+str(msg.payload.decode("utf-8")))

    if (str(msg.topic) != user+"/TX"):
        if(int(str(msg.payload.decode("utf-8"))) == 1):
            is_pressed = True
        else:
            is_pressed = False
    if str(msg.topic) == user+"/E6":
        button_state.set(4, is_pressed)
        print("Recebi uma mensagem de E6")

    elif str(msg.topic) == user+"/E5":
        button_state.set(3, is_pressed)
        print("Recebi uma mensagem de E5")

    elif str(msg.topic) == user+"/E4":
        button_state.set(2, is_pressed)
        print("Recebi uma mensagem de E4")

    elif str(msg.topic) == user+"/E3":
        button_state.set(1, is_pressed)
        print("Recebi uma mensagem de E3")

    elif str(msg.topic) == user+"/E2":
        button_state.set("iniciar", is_pressed)
        print("Recebi uma mensagem de E2")

    elif str(msg.topic) == user+"/S3":
        led_state.set(4, is_pressed)
        print("Recebi uma mensagem de S3")

    elif str(msg.topic) == user+"/S2":
        led_state.set(3, is_pressed)
        print("Recebi uma mensagem de S2")

    elif str(msg.topic) == user+"/S1":
        led_state.set(2, is_pressed)
        print("Recebi uma mensagem de S1")

    elif str(msg.topic) == user+"/S0":
        led_state.set(1, is_pressed)
        print("Recebi uma mensagem de S0")

    elif str(msg.topic) == user+"/S4":
        button_state.set("pronto", is_pressed)
        print("Recebi uma mensagem de S4")

    elif str(msg.topic) == user+"/TX":
        print("Recebi uma mensagem de TX")
        print(str(msg.payload.decode("utf-8")))
        leader_board.construct_message(str(msg.payload.decode("utf-8")))
        button_state.set("tx", True)

    else:
        print("Erro! Mensagem recebida de tópico estranho")
*/

const onMessage = (topic: string, message: Buffer) => {
    const decodedMsg = message?.toJSON()?.data; // or message.toString('utf8');
    console.log(message.toString());
};

// Turn off client
// client.end();
