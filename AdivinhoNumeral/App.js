import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard, Image } from 'react-native';

// Importe suas imagens com os nomes corretos
const characterExpressions = {
  thinking: require('./assets/characters/thinking.png'),
  happy: require('./assets/characters/happy.png'),
  sad: require('./assets/characters/sad.png'),
  surprised: require('./assets/characters/surprised.png'),
  neutral: require('./assets/characters/neutral.png'),
};

const App = () => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [guess, setGuess] = useState('');
  const [screen, setScreen] = useState('home');
  const [randomNumber, setRandomNumber] = useState(null);
  const [feedback, setFeedback] = useState('Tente adivinhar o número que estou pensando!');
  const [attempts, setAttempts] = useState(0);
  const [character, setCharacter] = useState(characterExpressions.neutral);

  const generateRandomNumber = () => {
    if (!min || !max) {
      Alert.alert('Erro', 'Por favor, preencha ambos os valores');
      return;
    }

    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (minNum >= maxNum) {
      Alert.alert('Erro', 'O valor mínimo deve ser menor que o máximo');
      return;
    }

    const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    setRandomNumber(random);
    setScreen('game');
    setFeedback(`Estou pensando em um número entre ${minNum} e ${maxNum}. Qual é seu palpite?`);
    setAttempts(0);
    setCharacter(characterExpressions.thinking);
    Keyboard.dismiss();
  };

  const updateCharacter = (difference, range, isHigher) => {
    const proximity = difference / range;
   
    if (proximity < 0.1) { // Muito perto
      setCharacter(characterExpressions.surprised);
    } else if (proximity < 0.3) { // Perto
      setCharacter(characterExpressions.neutral);
    } else { // Longe
      setCharacter(characterExpressions.sad);
    }
  };

  const checkGuess = () => {
    if (!guess) {
      Alert.alert('Erro', 'Por favor, digite um palpite');
      return;
    }

    const guessNum = parseInt(guess);
    const minNum = parseInt(min);
    const maxNum = parseInt(max);

    if (guessNum < minNum || guessNum > maxNum) {
      Alert.alert('Erro', `Seu palpite deve estar entre ${minNum} e ${maxNum}`);
      return;
    }

    setAttempts(attempts + 1);
    Keyboard.dismiss();

    if (guessNum === randomNumber) {
      setCharacter(characterExpressions.happy);
      setFeedback(`Parabéns! Você acertou em ${attempts + 1} tentativa(s)! O número era ${randomNumber}.`);
      setTimeout(() => {
        setScreen('home');
        setGuess('');
        setMin('');
        setMax('');
        setCharacter(characterExpressions.neutral);
      }, 3000);
      return;
    }

    const difference = Math.abs(randomNumber - guessNum);
    const range = maxNum - minNum;
    const isHigher = guessNum < randomNumber;
    const isClose = difference <= range * 0.1;

    updateCharacter(difference, range, isHigher);

    if (isHigher) {
      setFeedback(
        `Seu palpite está baixo. ${isClose ? 'Está perto! Tente um pouco mais alto.' : 'Tente um número mais alto.'}`
      );
    } else {
      setFeedback(
        `Seu palpite está alto. ${isClose ? 'Está perto! Tente um pouco mais baixo.' : 'Tente um número mais baixo.'}`
      );
    }

    setGuess('');
  };

  const goHome = () => {
    setScreen('home');
    setGuess('');
    setFeedback('Tente adivinhar o número que estou pensando!');
    setCharacter(characterExpressions.neutral);
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'home' ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Adivinhe o Número</Text>
          <Image 
            source={character} 
            style={styles.characterImage}
            onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
          />
          <Text style={styles.subtitle}>Escolha o intervalo de números</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mínimo:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={min}
              onChangeText={setMin}
              placeholder="Ex: 1"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Máximo:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={max}
              onChangeText={setMax}
              placeholder="Ex: 100"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={generateRandomNumber}>
            <Text style={styles.buttonText}>Gerar Número</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>

          <Image 
            source={character} 
            style={styles.characterImage}
            onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
          />
          <Text style={styles.feedback}>{feedback}</Text>

          <TextInput
            style={styles.guessInput}
            keyboardType="numeric"
            value={guess}
            onChangeText={setGuess}
            placeholder="Digite seu palpite"
            onSubmitEditing={checkGuess}
          />

          <TouchableOpacity style={styles.guessButton} onPress={checkGuess}>
            <Text style={styles.guessButtonText}>Verificar</Text>
          </TouchableOpacity>

          <Text style={styles.attempts}>Tentativas: {attempts}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  characterImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#593122',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  homeButtonText: {
    fontSize: 16,
    color: '#593122',
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    lineHeight: 26,
  },
  guessInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  guessButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#593122',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guessButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  attempts: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default App;