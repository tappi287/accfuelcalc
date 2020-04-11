'use_strict'

function main () {
  function ClearChildElements (parent) {
    /* Helper method to clear all child elements of a given parent */
    var child = parent.lastElementChild
    while (child) {
      parent.removeChild(child)
      child = parent.lastElementChild
    }
  }

  function CalculateFuel (lapTime, duration, fuel, extraLaps) {
    /* Simple fuel estimation by number of laps for given fuel consumption per lap */
    const laps = Math.ceil((duration * 60) / lapTime) + extraLaps
    const fuelAmount = Math.round(laps * fuel)
    return [fuelAmount, laps]
  }

  function UpdateResult () {
    /* Get race duration */
    const raceHour = parseInt(document.getElementsByName('race_hour')[0].value) * 60
    const raceMin = parseInt(document.getElementsByName('race_min')[0].value)
    const raceDuration = raceHour + raceMin

    /* Get lap time */
    const lapMin = parseInt(document.getElementsByName('lap_min')[0].value) * 60
    const lapSec = parseInt(document.getElementsByName('lap_sec')[0].value)
    const lapTho = parseInt(document.getElementsByName('lap_tho')[0].value) / 1000
    const lapTime = lapMin + lapSec + lapTho

    /* Get fuel consumtion per lap */
    const fuelConsumption = parseFloat(document.getElementsByName('fuel')[0].value)

    /* Get extra laps */
    const laps = parseInt(document.getElementsByName('laps')[0].value)

    DisplayResult(raceDuration, lapTime, fuelConsumption, laps)
  }

  function DisplayResult (userDuration, lapTime, fuelConsumption, laps) {
    const durations = [5, 10, 15, 20, 25, 30, 60]
    const resultList = document.getElementById('result_ls')

    /* Clear Result List */
    ClearChildElements(resultList)

    /* Update user result */
    const r = document.getElementById('custom_result')
    const f = CalculateFuel(lapTime, userDuration, fuelConsumption, laps)
    r.innerHTML = String(userDuration).padStart(3, '0') + ' mins - <b>' + String(f[0]).padStart(3, '0') + ' l</b> - ' + f[1] + ' laps'

    durations.forEach(duration => {
      const r = document.createElement('li')
      const f = CalculateFuel(lapTime, duration, fuelConsumption, laps)
      r.innerHTML = String(duration).padStart(3, '0') + ' mins - <b>' + String(f[0]).padStart(3, '0') + ' l</b> - ' + f[1] + ' laps'
      resultList.appendChild(r)
    })
  }

  function TrackSelect () {
    const track = document.getElementsByName('Track')[0]
    const lapMin = document.getElementsByName('lap_min')[0]
    const lapSec = document.getElementsByName('lap_sec')[0]
    const lapTho = document.getElementsByName('lap_tho')[0]

    track.addEventListener('change', function (event) {
      const v = event.target.value.split(':')

      /* Lookup fuel attribute in selected option element if present */
      const option = event.target.item(event.target.selectedIndex)
      const fuelValue = parseFloat(option.getAttribute('fuel'))

      /* Update fuel consumption if this track option entry has data for it */
      if (isNaN(fuelValue) === false) {
        document.getElementsByName('fuel')[0].value = fuelValue
      }

      /* Update estimated lap time */
      lapMin.value = v[0]
      lapSec.value = v[1]
      lapTho.value = v[2]
      UpdateResult()
    })
  }

  function InitUpdates () {
    /* Add change event isteners to every input element */
    const updateElements = [].slice.call(document.getElementsByTagName('input'))

    updateElements.forEach(inputElement => {
      inputElement.addEventListener('change', function (event) {
        UpdateResult()
      })
    })
  }

  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      TrackSelect() /* add track selection lap time convenience */
      InitUpdates() /* update result on any input */
      UpdateResult()
      console.log('Document ready.')
    }
  }
};

const fake = 'PassJStandardParse'
if (fake === null) {
  main()
}
