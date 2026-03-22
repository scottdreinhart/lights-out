export type Locale = 'en' | 'es' | 'de' | 'fr' | 'ko' | 'ja'

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es', 'de', 'fr', 'ko', 'ja']

export type TranslationKey =
  | 'app.splashEyebrow'
  | 'app.splashSubtitle'
  | 'app.backToMenu'
  | 'app.backButtonTitle'
  | 'app.closeGame'
  | 'app.closeGameButtonTitle'
  | 'app.headerTitle'
  | 'app.quickDifficulty'
  | 'app.quickRules'
  | 'app.dialog.leaveGameTitle'
  | 'app.dialog.leaveGameMessage'
  | 'app.dialog.deviceInfoTitle'
  | 'app.dialog.deviceInfoMessage'
  | 'app.toast.gameReset'
  | 'app.toast.openedDeviceInfo'
  | 'menu.open'
  | 'menu.close'
  | 'menu.title'
  | 'mainMenu.title'
  | 'mainMenu.subtitle'
  | 'mainMenu.playVsAi'
  | 'mainMenu.twoPlayer'
  | 'mainMenu.wins'
  | 'mainMenu.losses'
  | 'mainMenu.bestStreak'
  | 'mainMenu.hintLine1'
  | 'mainMenu.hintLine2'
  | 'settings.initialPiles'
  | 'settings.language'
  | 'settings.cancel'
  | 'settings.confirm'
  | 'settings.pileAria'
  | 'settings.themeAria'
  | 'settings.locale.en'
  | 'settings.locale.es'
  | 'settings.locale.de'
  | 'settings.locale.fr'
  | 'settings.locale.ko'
  | 'settings.locale.ja'
  | 'settings.preset.classic'
  | 'settings.preset.simple'
  | 'settings.preset.challenge'
  | 'settings.preset.quick'
  | 'settings.preset.grand'
  | 'settings.theme.chiba-city'
  | 'settings.theme.classic'
  | 'settings.theme.neon-arcade'
  | 'settings.theme.night-district'
  | 'settings.theme.gridline'
  | 'settings.theme.vaporwave'
  | 'settings.theme.synthwave'
  | 'settings.theme.high-contrast'
  | 'difficulty.groupAria'
  | 'difficulty.easy'
  | 'difficulty.medium'
  | 'difficulty.hard'
  | 'rules.groupAria'
  | 'rules.normal'
  | 'rules.misere'
  | 'game.player1Turn'
  | 'game.player2Turn'
  | 'game.yourTurn'
  | 'game.cpuThinking'
  | 'game.player1Wins'
  | 'game.player2Wins'
  | 'game.youWon'
  | 'game.youLost'
  | 'game.takeAllFromPile'
  | 'game.playAgain'
  | 'game.endTurn'
  | 'game.liveStatus'
  | 'offline.banner'
  | 'loading.text'
  | 'error.title'
  | 'error.unexpected'
  | 'error.retry'
  | 'error.details'
  | 'error.noStack'
  | 'error.attempt'
  | 'nim.coinAria'

const EN_TRANSLATIONS: Record<TranslationKey, string> = {
    'app.splashEyebrow': 'Stack. Remove. Win.',
    'app.splashSubtitle': 'Take the last stone, or force your opponent to',
    'app.backToMenu': 'Back to menu',
    'app.backButtonTitle': 'Back',
    'app.closeGame': 'Close game',
    'app.closeGameButtonTitle': 'Close game',
    'app.headerTitle': 'Game of Nim',
    'app.quickDifficulty': 'Difficulty',
    'app.quickRules': 'Rules',
    'app.dialog.leaveGameTitle': 'Leave current game?',
    'app.dialog.leaveGameMessage': 'Your current game will be abandoned.',
    'app.dialog.deviceInfoTitle': 'Open device info?',
    'app.dialog.deviceInfoMessage': 'This will leave the current game screen.',
    'app.toast.gameReset': 'Game reset.',
    'app.toast.openedDeviceInfo': 'Device info opened.',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'menu.title': 'Game settings',
    'mainMenu.title': 'Game of Nim',
    'mainMenu.subtitle': 'A classic strategy game',
    'mainMenu.playVsAi': 'Play vs AI',
    'mainMenu.twoPlayer': '2 Player',
    'mainMenu.wins': 'Wins',
    'mainMenu.losses': 'Losses',
    'mainMenu.bestStreak': 'Best Streak',
    'mainMenu.hintLine1': 'Remove objects from heaps.',
    'mainMenu.hintLine2': 'Choose Normal or Misère rules in Settings.',
    'settings.initialPiles': 'Initial Piles',
    'settings.language': 'Language',
    'settings.cancel': 'Cancel',
    'settings.confirm': 'OK',
    'settings.pileAria': 'Pile {index} count',
    'settings.themeAria': 'Use theme {theme}',
    'settings.locale.en': 'English',
    'settings.locale.es': 'Spanish',
    'settings.locale.de': 'German',
    'settings.locale.fr': 'French',
    'settings.locale.ko': 'Korean',
    'settings.locale.ja': 'Japanese',
    'settings.preset.classic': 'Classic',
    'settings.preset.simple': 'Simple',
    'settings.preset.challenge': 'Challenge',
    'settings.preset.quick': 'Quick',
    'settings.preset.grand': 'Grand',
    'settings.theme.chiba-city': 'Chiba City',
    'settings.theme.classic': 'Neon Core',
    'settings.theme.neon-arcade': 'Neon Arcade',
    'settings.theme.night-district': 'Night District',
    'settings.theme.gridline': 'Gridline',
    'settings.theme.vaporwave': 'Vaporwave',
    'settings.theme.synthwave': 'Synthwave',
    'settings.theme.high-contrast': 'High Contrast',
    'difficulty.groupAria': 'CPU difficulty',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'rules.groupAria': 'Game rules variant',
    'rules.normal': 'Normal',
    'rules.misere': 'Misère',
    'game.player1Turn': 'PLAYER 1',
    'game.player2Turn': 'PLAYER 2',
    'game.yourTurn': "IT'S YOUR TURN",
    'game.cpuThinking': 'CPU THINKING',
    'game.player1Wins': 'PLAYER 1 WINS!',
    'game.player2Wins': 'PLAYER 2 WINS!',
    'game.youWon': 'YOU WON!',
    'game.youLost': 'YOU LOST!',
    'game.takeAllFromPile': 'Take all from pile {pile}',
    'game.playAgain': 'PLAY AGAIN',
    'game.endTurn': 'End Turn',
    'game.liveStatus': 'Game status',
    'offline.banner': 'You are offline — game continues locally',
    'loading.text': 'Loading...',
    'error.title': 'Something went wrong',
    'error.unexpected': 'An unexpected error occurred.',
    'error.retry': 'Try Again',
    'error.details': 'Error details',
    'error.noStack': 'No stack trace available',
    'error.attempt': 'Attempt {count}',
    'nim.coinAria': 'Nim coin',
}

const ES_TRANSLATIONS: Record<TranslationKey, string> = {
    'app.splashEyebrow': 'Apila. Quita. Gana.',
    'app.splashSubtitle': 'Toma la última ficha, o fuerza a tu rival',
    'app.backToMenu': 'Volver al menú',
    'app.backButtonTitle': 'Volver',
    'app.closeGame': 'Cerrar partida',
    'app.closeGameButtonTitle': 'Cerrar partida',
    'app.headerTitle': 'Juego de Nim',
    'app.quickDifficulty': 'Dificultad',
    'app.quickRules': 'Reglas',
    'app.dialog.leaveGameTitle': '¿Salir de la partida actual?',
    'app.dialog.leaveGameMessage': 'La partida actual se abandonará.',
    'app.dialog.deviceInfoTitle': '¿Abrir información del dispositivo?',
    'app.dialog.deviceInfoMessage': 'Esto saldrá de la pantalla actual del juego.',
    'app.toast.gameReset': 'Partida reiniciada.',
    'app.toast.openedDeviceInfo': 'Información del dispositivo abierta.',
    'menu.open': 'Abrir menú',
    'menu.close': 'Cerrar menú',
    'menu.title': 'Ajustes del juego',
    'mainMenu.title': 'Juego de Nim',
    'mainMenu.subtitle': 'Un juego clásico de estrategia',
    'mainMenu.playVsAi': 'Jugar vs IA',
    'mainMenu.twoPlayer': '2 jugadores',
    'mainMenu.wins': 'Victorias',
    'mainMenu.losses': 'Derrotas',
    'mainMenu.bestStreak': 'Mejor racha',
    'mainMenu.hintLine1': 'Quita objetos de las pilas.',
    'mainMenu.hintLine2': 'Elige reglas Normal o Misère en Ajustes.',
    'settings.initialPiles': 'Pilas iniciales',
    'settings.language': 'Idioma',
    'settings.cancel': 'Cancelar',
    'settings.confirm': 'Aceptar',
    'settings.pileAria': 'Cantidad de la pila {index}',
    'settings.themeAria': 'Usar tema {theme}',
    'settings.locale.en': 'Inglés',
    'settings.locale.es': 'Español',
    'settings.locale.de': 'Alemán',
    'settings.locale.fr': 'Francés',
    'settings.locale.ko': 'Coreano',
    'settings.locale.ja': 'Japonés',
    'settings.preset.classic': 'Clásico',
    'settings.preset.simple': 'Simple',
    'settings.preset.challenge': 'Desafío',
    'settings.preset.quick': 'Rápido',
    'settings.preset.grand': 'Grande',
    'settings.theme.chiba-city': 'Ciudad Chiba',
    'settings.theme.classic': 'Núcleo Neón',
    'settings.theme.neon-arcade': 'Arcade Neón',
    'settings.theme.night-district': 'Distrito Nocturno',
    'settings.theme.gridline': 'Cuadrícula',
    'settings.theme.vaporwave': 'Vaporwave',
    'settings.theme.synthwave': 'Synthwave',
    'settings.theme.high-contrast': 'Alto Contraste',
    'difficulty.groupAria': 'Dificultad de CPU',
    'difficulty.easy': 'Fácil',
    'difficulty.medium': 'Media',
    'difficulty.hard': 'Difícil',
    'rules.groupAria': 'Variante de reglas',
    'rules.normal': 'Normal',
    'rules.misere': 'Misère',
    'game.player1Turn': 'JUGADOR 1',
    'game.player2Turn': 'JUGADOR 2',
    'game.yourTurn': 'ES TU TURNO',
    'game.cpuThinking': 'CPU PENSANDO',
    'game.player1Wins': '¡GANA JUGADOR 1!',
    'game.player2Wins': '¡GANA JUGADOR 2!',
    'game.youWon': '¡GANASTE!',
    'game.youLost': '¡PERDISTE!',
    'game.takeAllFromPile': 'Tomar todo de la pila {pile}',
    'game.playAgain': 'JUGAR DE NUEVO',
    'game.endTurn': 'Terminar turno',
    'game.liveStatus': 'Estado de la partida',
    'offline.banner': 'Sin conexión — la partida continúa localmente',
    'loading.text': 'Cargando...',
    'error.title': 'Algo salió mal',
    'error.unexpected': 'Ocurrió un error inesperado.',
    'error.retry': 'Reintentar',
    'error.details': 'Detalles del error',
    'error.noStack': 'No hay traza de pila disponible',
    'error.attempt': 'Intento {count}',
    'nim.coinAria': 'Ficha de Nim',
}

const DE_TRANSLATIONS: Record<TranslationKey, string> = {
  'app.splashEyebrow': 'Stapeln. Nehmen. Gewinnen.',
  'app.splashSubtitle': 'Nehmen Sie den letzten Stein oder zwingen Sie Ihren Gegner, ihn zu nehmen',
  'app.backToMenu': 'Zurück zum Menü',
  'app.backButtonTitle': 'Zurück',
  'app.closeGame': 'Spiel schließen',
  'app.closeGameButtonTitle': 'Spiel schließen',
  'app.headerTitle': 'Nim-Spiel',
  'app.quickDifficulty': 'Schwierigkeit',
  'app.quickRules': 'Regeln',
  'app.dialog.leaveGameTitle': 'Aktuelles Spiel verlassen?',
  'app.dialog.leaveGameMessage': 'Dein aktuelles Spiel wird verworfen.',
  'app.dialog.deviceInfoTitle': 'Geräteinfo öffnen?',
  'app.dialog.deviceInfoMessage': 'Dadurch wird der aktuelle Spielbildschirm verlassen.',
  'app.toast.gameReset': 'Spiel zurückgesetzt.',
  'app.toast.openedDeviceInfo': 'Geräteinfo geöffnet.',
  'menu.open': 'Menü öffnen',
  'menu.close': 'Menü schließen',
  'menu.title': 'Spieleinstellungen',
  'mainMenu.title': 'Nim-Spiel',
  'mainMenu.subtitle': 'Ein klassisches Strategiespiel',
  'mainMenu.playVsAi': 'Gegen KI spielen',
  'mainMenu.twoPlayer': '2 Spieler',
  'mainMenu.wins': 'Siege',
  'mainMenu.losses': 'Niederlagen',
  'mainMenu.bestStreak': 'Beste Serie',
  'mainMenu.hintLine1': 'Entferne Objekte aus den Haufen.',
  'mainMenu.hintLine2': 'Wähle im Menü zwischen Normal- und Misère-Regeln.',
  'settings.initialPiles': 'Anfangshaufen',
  'settings.language': 'Sprache',
  'settings.cancel': 'Abbrechen',
  'settings.confirm': 'OK',
  'settings.pileAria': 'Anzahl im Haufen {index}',
  'settings.themeAria': 'Theme {theme} verwenden',
  'settings.locale.en': 'Englisch',
  'settings.locale.es': 'Spanisch',
  'settings.locale.de': 'Deutsch',
  'settings.locale.fr': 'Französisch',
  'settings.locale.ko': 'Koreanisch',
  'settings.locale.ja': 'Japanisch',
  'settings.preset.classic': 'Klassisch',
  'settings.preset.simple': 'Einfach',
  'settings.preset.challenge': 'Herausforderung',
  'settings.preset.quick': 'Schnell',
  'settings.preset.grand': 'Groß',
  'settings.theme.chiba-city': 'Chiba City',
  'settings.theme.classic': 'Neon Core',
  'settings.theme.neon-arcade': 'Neon Arcade',
  'settings.theme.night-district': 'Night District',
  'settings.theme.gridline': 'Gridline',
  'settings.theme.vaporwave': 'Vaporwave',
  'settings.theme.synthwave': 'Synthwave',
  'settings.theme.high-contrast': 'Hoher Kontrast',
  'difficulty.groupAria': 'KI-Schwierigkeit',
  'difficulty.easy': 'Leicht',
  'difficulty.medium': 'Mittel',
  'difficulty.hard': 'Schwer',
  'rules.groupAria': 'Spielregel-Variante',
  'rules.normal': 'Normal',
  'rules.misere': 'Misère',
  'game.player1Turn': 'SPIELER 1',
  'game.player2Turn': 'SPIELER 2',
  'game.yourTurn': 'SIE SIND AM ZUG',
  'game.cpuThinking': 'KI DENKT NACH',
  'game.player1Wins': 'SPIELER 1 GEWINNT!',
  'game.player2Wins': 'SPIELER 2 GEWINNT!',
  'game.youWon': 'SIE HABEN GEWONNEN!',
  'game.youLost': 'SIE HABEN VERLOREN!',
  'game.takeAllFromPile': 'Alles aus Haufen {pile} nehmen',
  'game.playAgain': 'NOCHMAL SPIELEN',
  'game.endTurn': 'Zug beenden',
  'game.liveStatus': 'Spielstatus',
  'offline.banner': 'Du bist offline — das Spiel läuft lokal weiter',
  'loading.text': 'Lädt...',
  'error.title': 'Etwas ist schiefgelaufen',
  'error.unexpected': 'Ein unerwarteter Fehler ist aufgetreten.',
  'error.retry': 'Erneut versuchen',
  'error.details': 'Fehlerdetails',
  'error.noStack': 'Kein Stack-Trace verfügbar',
  'error.attempt': 'Versuch {count}',
  'nim.coinAria': 'Nim-Stein',
}

const FR_TRANSLATIONS: Record<TranslationKey, string> = {
  'app.splashEyebrow': 'Empiler. Retirer. Gagner.',
  'app.splashSubtitle': 'Prenez la dernière pierre, ou forcez votre adversaire à la prendre',
  'app.backToMenu': 'Retour au menu',
  'app.backButtonTitle': 'Retour',
  'app.closeGame': 'Fermer la partie',
  'app.closeGameButtonTitle': 'Fermer la partie',
  'app.headerTitle': 'Jeu de Nim',
  'app.quickDifficulty': 'Difficulté',
  'app.quickRules': 'Règles',
  'app.dialog.leaveGameTitle': 'Quitter la partie en cours ?',
  'app.dialog.leaveGameMessage': 'Votre partie actuelle sera abandonnée.',
  'app.dialog.deviceInfoTitle': 'Ouvrir les infos de l\'appareil ?',
  'app.dialog.deviceInfoMessage': 'Cela quittera l\'écran de jeu actuel.',
  'app.toast.gameReset': 'Partie réinitialisée.',
  'app.toast.openedDeviceInfo': 'Infos de l\'appareil ouvertes.',
  'menu.open': 'Ouvrir le menu',
  'menu.close': 'Fermer le menu',
  'menu.title': 'Paramètres du jeu',
  'mainMenu.title': 'Jeu de Nim',
  'mainMenu.subtitle': 'Un jeu de stratégie classique',
  'mainMenu.playVsAi': 'Jouer contre l\'IA',
  'mainMenu.twoPlayer': '2 joueurs',
  'mainMenu.wins': 'Victoires',
  'mainMenu.losses': 'Défaites',
  'mainMenu.bestStreak': 'Meilleure série',
  'mainMenu.hintLine1': 'Retirez des objets des tas.',
  'mainMenu.hintLine2': 'Choisissez les règles Normal ou Misère dans le menu.',
  'settings.initialPiles': 'Tas initiaux',
  'settings.language': 'Langue',
  'settings.cancel': 'Annuler',
  'settings.confirm': 'OK',
  'settings.pileAria': 'Nombre dans le tas {index}',
  'settings.themeAria': 'Utiliser le thème {theme}',
  'settings.locale.en': 'Anglais',
  'settings.locale.es': 'Espagnol',
  'settings.locale.de': 'Allemand',
  'settings.locale.fr': 'Français',
  'settings.locale.ko': 'Coréen',
  'settings.locale.ja': 'Japonais',
  'settings.preset.classic': 'Classique',
  'settings.preset.simple': 'Simple',
  'settings.preset.challenge': 'Défi',
  'settings.preset.quick': 'Rapide',
  'settings.preset.grand': 'Grand',
  'settings.theme.chiba-city': 'Chiba City',
  'settings.theme.classic': 'Neon Core',
  'settings.theme.neon-arcade': 'Neon Arcade',
  'settings.theme.night-district': 'Night District',
  'settings.theme.gridline': 'Gridline',
  'settings.theme.vaporwave': 'Vaporwave',
  'settings.theme.synthwave': 'Synthwave',
  'settings.theme.high-contrast': 'Contraste élevé',
  'difficulty.groupAria': 'Difficulté de l\'IA',
  'difficulty.easy': 'Facile',
  'difficulty.medium': 'Moyen',
  'difficulty.hard': 'Difficile',
  'rules.groupAria': 'Variante des règles',
  'rules.normal': 'Normal',
  'rules.misere': 'Misère',
  'game.player1Turn': 'JOUEUR 1',
  'game.player2Turn': 'JOUEUR 2',
  'game.yourTurn': 'À VOUS DE JOUER',
  'game.cpuThinking': 'L\'IA RÉFLÉCHIT',
  'game.player1Wins': 'JOUEUR 1 GAGNE !',
  'game.player2Wins': 'JOUEUR 2 GAGNE !',
  'game.youWon': 'VOUS AVEZ GAGNÉ !',
  'game.youLost': 'VOUS AVEZ PERDU !',
  'game.takeAllFromPile': 'Prendre tout du tas {pile}',
  'game.playAgain': 'REJOUER',
  'game.endTurn': 'Terminer le tour',
  'game.liveStatus': 'État de la partie',
  'offline.banner': 'Vous êtes hors ligne — la partie continue en local',
  'loading.text': 'Chargement...',
  'error.title': 'Un problème est survenu',
  'error.unexpected': 'Une erreur inattendue est survenue.',
  'error.retry': 'Réessayer',
  'error.details': 'Détails de l\'erreur',
  'error.noStack': 'Aucune trace de pile disponible',
  'error.attempt': 'Tentative {count}',
  'nim.coinAria': 'Jeton de Nim',
}

const KO_TRANSLATIONS: Record<TranslationKey, string> = {
  'app.splashEyebrow': '쌓고. 가져가고. 승리하세요.',
  'app.splashSubtitle': '마지막 돌을 가져가거나 상대가 가져가게 만드세요',
  'app.backToMenu': '메뉴로 돌아가기',
  'app.backButtonTitle': '뒤로',
  'app.closeGame': '게임 닫기',
  'app.closeGameButtonTitle': '게임 닫기',
  'app.headerTitle': '님 게임',
  'app.quickDifficulty': '난이도',
  'app.quickRules': '규칙',
  'app.dialog.leaveGameTitle': '현재 게임을 나가시겠습니까?',
  'app.dialog.leaveGameMessage': '현재 진행 중인 게임이 종료됩니다.',
  'app.dialog.deviceInfoTitle': '기기 정보를 여시겠습니까?',
  'app.dialog.deviceInfoMessage': '현재 게임 화면에서 나가게 됩니다.',
  'app.toast.gameReset': '게임이 초기화되었습니다.',
  'app.toast.openedDeviceInfo': '기기 정보를 열었습니다.',
  'menu.open': '메뉴 열기',
  'menu.close': '메뉴 닫기',
  'menu.title': '게임 설정',
  'mainMenu.title': '님 게임',
  'mainMenu.subtitle': '고전 전략 게임',
  'mainMenu.playVsAi': 'AI와 플레이',
  'mainMenu.twoPlayer': '2인 플레이',
  'mainMenu.wins': '승리',
  'mainMenu.losses': '패배',
  'mainMenu.bestStreak': '최고 연승',
  'mainMenu.hintLine1': '더미에서 개체를 제거하세요.',
  'mainMenu.hintLine2': '메뉴에서 일반 또는 미제르 규칙을 선택하세요.',
  'settings.initialPiles': '초기 더미',
  'settings.language': '언어',
  'settings.cancel': '취소',
  'settings.confirm': '확인',
  'settings.pileAria': '{index}번 더미 개수',
  'settings.themeAria': '{theme} 테마 사용',
  'settings.locale.en': '영어',
  'settings.locale.es': '스페인어',
  'settings.locale.de': '독일어',
  'settings.locale.fr': '프랑스어',
  'settings.locale.ko': '한국어',
  'settings.locale.ja': '일본어',
  'settings.preset.classic': '클래식',
  'settings.preset.simple': '심플',
  'settings.preset.challenge': '도전',
  'settings.preset.quick': '빠름',
  'settings.preset.grand': '그랜드',
  'settings.theme.chiba-city': '치바 시티',
  'settings.theme.classic': '네온 코어',
  'settings.theme.neon-arcade': '네온 아케이드',
  'settings.theme.night-district': '나이트 디스트릭트',
  'settings.theme.gridline': '그리드라인',
  'settings.theme.vaporwave': '베이퍼웨이브',
  'settings.theme.synthwave': '신스웨이브',
  'settings.theme.high-contrast': '고대비',
  'difficulty.groupAria': 'CPU 난이도',
  'difficulty.easy': '쉬움',
  'difficulty.medium': '보통',
  'difficulty.hard': '어려움',
  'rules.groupAria': '게임 규칙 유형',
  'rules.normal': '일반',
  'rules.misere': '미제르',
  'game.player1Turn': '플레이어 1',
  'game.player2Turn': '플레이어 2',
  'game.yourTurn': '당신의 차례입니다',
  'game.cpuThinking': 'CPU 생각 중',
  'game.player1Wins': '플레이어 1 승리!',
  'game.player2Wins': '플레이어 2 승리!',
  'game.youWon': '승리했습니다!',
  'game.youLost': '패배했습니다!',
  'game.takeAllFromPile': '{pile}번 더미에서 모두 가져가기',
  'game.playAgain': '다시 플레이',
  'game.endTurn': '턴 종료',
  'game.liveStatus': '게임 상태',
  'offline.banner': '오프라인 상태입니다 — 게임은 로컬에서 계속됩니다',
  'loading.text': '로딩 중...',
  'error.title': '문제가 발생했습니다',
  'error.unexpected': '예기치 않은 오류가 발생했습니다.',
  'error.retry': '다시 시도',
  'error.details': '오류 세부정보',
  'error.noStack': '스택 추적 정보가 없습니다',
  'error.attempt': '시도 {count}',
  'nim.coinAria': '님 코인',
}

const JA_TRANSLATIONS: Record<TranslationKey, string> = {
  'app.splashEyebrow': '積む。取る。勝つ。',
  'app.splashSubtitle': '最後の石を取るか、相手に取らせましょう',
  'app.backToMenu': 'メニューに戻る',
  'app.backButtonTitle': '戻る',
  'app.closeGame': 'ゲームを閉じる',
  'app.closeGameButtonTitle': 'ゲームを閉じる',
  'app.headerTitle': 'ニムゲーム',
  'app.quickDifficulty': '難易度',
  'app.quickRules': 'ルール',
  'app.dialog.leaveGameTitle': '現在のゲームを終了しますか？',
  'app.dialog.leaveGameMessage': '現在のゲームは破棄されます。',
  'app.dialog.deviceInfoTitle': 'デバイス情報を開きますか？',
  'app.dialog.deviceInfoMessage': '現在のゲーム画面を離れます。',
  'app.toast.gameReset': 'ゲームをリセットしました。',
  'app.toast.openedDeviceInfo': 'デバイス情報を開きました。',
  'menu.open': 'メニューを開く',
  'menu.close': 'メニューを閉じる',
  'menu.title': 'ゲーム設定',
  'mainMenu.title': 'ニムゲーム',
  'mainMenu.subtitle': 'クラシックな戦略ゲーム',
  'mainMenu.playVsAi': 'AIと対戦',
  'mainMenu.twoPlayer': '2人プレイ',
  'mainMenu.wins': '勝利',
  'mainMenu.losses': '敗北',
  'mainMenu.bestStreak': '最高連勝',
  'mainMenu.hintLine1': '山からオブジェクトを取り除いてください。',
  'mainMenu.hintLine2': 'メニューで通常ルールまたはミゼールルールを選択してください。',
  'settings.initialPiles': '初期の山',
  'settings.language': '言語',
  'settings.cancel': 'キャンセル',
  'settings.confirm': 'OK',
  'settings.pileAria': '山 {index} の数',
  'settings.themeAria': '{theme} テーマを使用',
  'settings.locale.en': '英語',
  'settings.locale.es': 'スペイン語',
  'settings.locale.de': 'ドイツ語',
  'settings.locale.fr': 'フランス語',
  'settings.locale.ko': '韓国語',
  'settings.locale.ja': '日本語',
  'settings.preset.classic': 'クラシック',
  'settings.preset.simple': 'シンプル',
  'settings.preset.challenge': 'チャレンジ',
  'settings.preset.quick': 'クイック',
  'settings.preset.grand': 'グランド',
  'settings.theme.chiba-city': 'チバシティ',
  'settings.theme.classic': 'ネオンコア',
  'settings.theme.neon-arcade': 'ネオンアーケード',
  'settings.theme.night-district': 'ナイトディストリクト',
  'settings.theme.gridline': 'グリッドライン',
  'settings.theme.vaporwave': 'ベイパーウェーブ',
  'settings.theme.synthwave': 'シンセウェーブ',
  'settings.theme.high-contrast': 'ハイコントラスト',
  'difficulty.groupAria': 'CPU難易度',
  'difficulty.easy': 'かんたん',
  'difficulty.medium': 'ふつう',
  'difficulty.hard': 'むずかしい',
  'rules.groupAria': 'ゲームルールの種類',
  'rules.normal': '通常',
  'rules.misere': 'ミゼール',
  'game.player1Turn': 'プレイヤー1',
  'game.player2Turn': 'プレイヤー2',
  'game.yourTurn': 'あなたの番です',
  'game.cpuThinking': 'CPU思考中',
  'game.player1Wins': 'プレイヤー1の勝ち！',
  'game.player2Wins': 'プレイヤー2の勝ち！',
  'game.youWon': 'あなたの勝ちです！',
  'game.youLost': 'あなたの負けです！',
  'game.takeAllFromPile': '山 {pile} からすべて取る',
  'game.playAgain': 'もう一度プレイ',
  'game.endTurn': 'ターン終了',
  'game.liveStatus': 'ゲーム状況',
  'offline.banner': 'オフラインです — ゲームはローカルで続行されます',
  'loading.text': '読み込み中...',
  'error.title': '問題が発生しました',
  'error.unexpected': '予期しないエラーが発生しました。',
  'error.retry': '再試行',
  'error.details': 'エラー詳細',
  'error.noStack': 'スタックトレースはありません',
  'error.attempt': '試行 {count}',
  'nim.coinAria': 'ニムコイン',
}

const TRANSLATIONS: Record<Locale, Record<TranslationKey, string>> = {
  en: EN_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  de: DE_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  ko: KO_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
}

export type TranslationParams = Record<string, string | number>

export const translate = (
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string => {
  const template = TRANSLATIONS[locale][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key
  if (!params) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}
