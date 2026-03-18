/* ============================================================
   api/lol-stats.js
   Vercel Serverless Function — consulta la API de Riot Games.
   Retorna: rango, stats y puntos de maestría de los mains.
   ============================================================ */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY  = process.env.RIOT_API_KEY;
  const SUMMONER = 'ElJavi';
  const TAG_LINE = 'LAN';
  const REGION   = 'americas';
  const PLATFORM = 'la1';

  /* IDs de campeones (Data Dragon) */
  const MAINS = [
    { id: 141, name: 'Kayn',    role: 'JG', color: '#c084fc' },
    { id: 234, name: 'Viego',   role: 'JG', color: '#818cf8' },
    { id: 64,  name: 'Lee Sin', role: 'JG', color: '#fb923c' }
  ];

  function formatMastery(points) {
    if (points >= 1000000) return (points / 1000000).toFixed(1) + 'M';
    if (points >= 1000)    return Math.floor(points / 1000) + 'k';
    return points.toString();
  }

  try {
    /* 1. PUUID por Riot ID */
    const accountRes = await fetch(
      `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${SUMMONER}/${TAG_LINE}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );
    if (!accountRes.ok) throw new Error('Cuenta no encontrada');
    const account = await accountRes.json();
    const puuid   = account.puuid;

    /* 2. Summoner ID */
    const summonerRes = await fetch(
      `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );
    const summoner = await summonerRes.json();

    /* 3. Rango Solo/Duo */
    const rankRes = await fetch(
      `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );
    const rankData  = await rankRes.json();
    const rankArray = Array.isArray(rankData) ? rankData : [];
    const soloQueue = rankArray.find(q => q.queueType === 'RANKED_SOLO_5x5') || null;

    function calcWinrate(queue) {
      if (!queue) return null;
      const total = queue.wins + queue.losses;
      return {
        tier:    queue.tier,
        rank:    queue.rank,
        lp:      queue.leaguePoints,
        wins:    queue.wins,
        losses:  queue.losses,
        played:  total,
        winrate: total > 0 ? Math.round((queue.wins / total) * 100) : 0
      };
    }

    /* 4. Maestría de los 3 mains en paralelo */
    const masteryResults = await Promise.all(
      MAINS.map(async (champ) => {
        try {
          const r = await fetch(
            `https://${PLATFORM}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${champ.id}`,
            { headers: { 'X-Riot-Token': API_KEY } }
          );
          if (!r.ok) return { ...champ, mastery: 0, masteryFmt: '0', level: 0 };
          const data = await r.json();
          return {
            ...champ,
            mastery:    data.championPoints,
            masteryFmt: formatMastery(data.championPoints),
            level:      data.championLevel
          };
        } catch {
          return { ...champ, mastery: 0, masteryFmt: '0', level: 0 };
        }
      })
    );

    /* 5. Respuesta final */
    res.status(200).json({
      summoner: {
        name:  account.gameName,
        tag:   account.tagLine,
        level: summoner.summonerLevel
      },
      solo:  calcWinrate(soloQueue),
      mains: masteryResults
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
