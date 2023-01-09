// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.query.origin}&destinations=${req.query.destination}&units=imperial&key=AIzaSyAcOlKeHv8hUrp3ipcQ_vODkMLSaBKZ2YQ`, {
      method: 'get',
      headers: {
          'Content-Type': 'application/json'
      },
      mode: 'cors'
  })
  .then(resp => resp.json())
  .then(data => res.status(200).json(data));
  
}
