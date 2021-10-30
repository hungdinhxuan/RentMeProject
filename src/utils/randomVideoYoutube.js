import axios from 'axios'

const MAX_RESULTS = 50

export default function getRandomVideoFromYoutube () {
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/search'
    const params = {
      part: 'snippet',
      type: 'video',
      maxResults: MAX_RESULTS,
      key: process.env.REACT_APP_YOUTUBE_API_KEY,
      q: 'lol'
    }
    axios.get(url, { params })
      .then(response => {
        const video = response.data.items[Math.floor(Math.random() * response.data.items.length)].id.videoId
        resolve(video)
      })
      .catch(error => {
        reject(error)
      })
  })
}


