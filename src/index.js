const personagens = [
        {
        NOME: "Mario",
        VELOCIDADE: 4,
        MANOBRABILIDADE: 3,
        PODER: 3,
        PONTOS: 0,
    },
    {
        NOME: "Luigi",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 4,
        PONTOS: 0,
    },
    {
        NOME: "Peach",
        VELOCIDADE: 4,
        MANOBRABILIDADE: 3,
        PODER: 3,
        PONTOS: 0,
    },
    {
        NOME: "Toad",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 4,
        PONTOS: 0,
    },
    {
        NOME: "Donkey Kong",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0,
    },
    {
        NOME: "Yoshi",
        VELOCIDADE: 4,
        MANOBRABILIDADE: 3,
        PODER: 3,
        PONTOS: 0,
    },
    {
        NOME: "Bowser",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0,
    },
        {
        NOME: "Bowser Jr.",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 2,
        PODER: 3,
        PONTOS: 0,
    }
]

//rolar dados
async function rollDice() {
    return Math.floor(Math.random() * 6) + 1
}

// SORTEIO DE BLOCO ALEATÓRIO
async function getRandomBlock() {
     let random = Math.random()
    let result

    switch (true) {
        case random < 0.33:
            result = "RETA"
            break
        case random < 0.66:
            result = "CURVA"
            break
        default:
            result = "CONFRONTO"
            break
    }

    return result
}

// LOGAR RESULTADO DO DADO
async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`)
}

//listar personagens randomizados do objeto fornecido
function listRandomizedCharacters(personagens) {
    const shuffledCharacters = [...personagens].sort(() => Math.random() - 0.5)
    return shuffledCharacters
}

function getRandomConfrontoItem() {
    const itens = [
        { nome: "Casco", emoji: "🐢", perda: 1 },
        { nome: "Bomba", emoji: "💣", perda: 2 }
    ]

    const randomIndex = Math.floor(Math.random() * itens.length)
    return itens[randomIndex]
}

// SORTEIO DE PERSONAGEM ALEATÓRIO
function getRandomCharacter(excludedName = null) {
    const availableCharacters = Object.values(personagens).filter(
        (character) => character.NOME !== excludedName
    )
    const randomIndex = Math.floor(Math.random() * availableCharacters.length)

    return availableCharacters[randomIndex]
}

// executar motor da corrida
async function playRaceEngine(competidores) {

    for (let volta = 1; volta <= 5; volta++) {

        console.log(`🏁 Rodada ${volta}`)

        let block = await getRandomBlock()
        console.log(`Bloco: ${block}`)

        const resultados = []

        for (const jogador of competidores) {
            //ROLAR DADOS
            const dado = await rollDice()
            let total = 0

            
            if (block === "RETA") {
                total = dado + jogador.VELOCIDADE

                await logRollResult(
                    jogador.NOME,
                    "velocidade",
                    dado,
                    jogador.VELOCIDADE
                )
            }

            if (block === "CURVA") {
                total = dado + jogador.MANOBRABILIDADE

                await logRollResult(
                    jogador.NOME,
                    "manobrabilidade",
                    dado,
                    jogador.MANOBRABILIDADE
                )
            }

            if (block === "CONFRONTO") {
                total = dado + jogador.PODER

                await logRollResult(
                    jogador.NOME,
                    "poder",
                    dado,
                    jogador.PODER
                )
            }
                resultados.push({jogador,total})
        }

        resultados.sort((a, b) => b.total - a.total)

        const vencedor = resultados[0]

        if (block === "CONFRONTO") {
            // Turbo para quem venceu o confronto
            vencedor.jogador.PONTOS++
            console.log(`⚡ ${vencedor.jogador.NOME} venceu o confronto e ganhou Turbo (+1 ponto)`)

            // Penalidade aleatória para os demais competidores
            for (let i = 1; i < resultados.length; i++) {
                const derrotado = resultados[i].jogador
                const item = getRandomConfrontoItem()
                const perdaAplicada = Math.min(item.perda, derrotado.PONTOS)

                derrotado.PONTOS -= perdaAplicada

                console.log(
                    `${item.emoji} ${derrotado.NOME} recebeu ${item.nome} e perdeu ${perdaAplicada} ponto(s)`
                )
            }
        } else {
            vencedor.jogador.PONTOS++
            console.log(`⭐ ${vencedor.jogador.NOME} venceu a rodada e ganhou 1 ponto`)
        }
        console.log("___________________________________________________")
    }
}

// DECLARAR VENCEDOR
function declareWinner(competidores) {

    competidores.sort((a, b) => b.PONTOS - a.PONTOS)

    console.log("\n🏆 Classificação Final")

    competidores.forEach((jogador, posicao) => {
        console.log(
            `${posicao + 1}º - ${jogador.NOME}: ${jogador.PONTOS} ponto(s)`
        )
    })

    console.log(
        `\n🥇 Campeão: ${competidores[0].NOME}`
    )
}

(async function main() {

    console.log(
        `🏁🚨 Corrida com ${personagens.length} competidores começando...\n`
    )

    console.log(`Competidores:\n ${listRandomizedCharacters(personagens).map(jogador => jogador.NOME).join('\n ')}` )

    await playRaceEngine(personagens)
    await declareWinner(personagens)
})()