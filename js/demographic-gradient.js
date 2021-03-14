import { state } from './state.js'
import { snackbar, closeModal } from './interface.js'

const getData = (param) => {
    let values = []
    switch (param) {
        case 'totalPopulation':
            state.currentGradientProperty = 'Total Population'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.totalPopulation
            }))
            return values
        case 'sexRatio':
            state.currentGradientProperty = 'Sex Ratio'
            state.datasets.demographic.data.data.map(region => values.push({
                gid: region.gid,
                data: region.sexRatio
            }))
            return values
        case 'childSexRatio':
            state.currentGradientProperty = 'Child Sex Ratio'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.childSexRatio
            }))
            return values
        case 'familySize':
            state.currentGradientProperty = 'Family Size'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.familySize
            }))
            return values
        case 'averageLiteracy':
            state.currentGradientProperty = 'Average Literacy'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.avgLiteracy
            }))
            return values
        case 'femaleLiteracy':
            state.currentGradientProperty = 'Female Literacy'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.femaleLiteracy
            }))
            return values
        case 'maleLiteracy':
            state.currentGradientProperty = 'Male Literacy'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.maleLiteracy
            }))
            return values
        case 'avgFamilyIncome':
            state.currentGradientProperty = 'Average Family Income'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.avgFamilyIncome
            }))
            return values
        case 'avgEarningMember':
            state.currentGradientProperty = 'Average Earning Member'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.avgEarningMember
            }))
            return values
        case 'underweight':
            state.currentGradientProperty = '% of Children Who Are Underweight'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.underweight
            }))
            return values
        case 'stunted':
            state.currentGradientProperty = '% of Children Who Are Stunted'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.stunted
            }))
            return values
        case 'wasted':
            state.currentGradientProperty = '% of Children Who Are Wasted'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.wasted
            }))
            return values
        case 'anaemia':
            state.currentGradientProperty = 'Anaemia in Pregnant Women (%)'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.anaemia
            }))
            return values
        case 'infantMortality':
            state.currentGradientProperty = 'Infant Mortality'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.infantMortality
            }))
            return values
        case 'commDiseases':
            state.currentGradientProperty = 'Total Number of Cases of Communicable Diseases'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.totalCommDiseases
            }))
            return values
        case 'nonCommDiseases':
            state.currentGradientProperty = 'Total Number of Cases of Non Communicable Diseases'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.totalNonCommDiseases
            }))
            return values
        case 'densityGovtDisp':
            state.currentGradientProperty = 'Density of Government Dispensaries to Population'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.densityGovtDisp
            }))
            return values
        case 'noInsurance':
            state.currentGradientProperty = '% of Households where No Member has Insurance'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.noInsurance
            }))
            return values
        case 'densityGovtDisp':
            state.currentGradientProperty = 'Density of Government Dispensaries to Population'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.densityGovtDisp
            }))
            return values
        case 'percentIncomeHealth':
            state.currentGradientProperty = '% of Annual Family Income Spent on Health'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.percentIncomeHealth
            }))
            return values
        case 'noInsurance':
            state.currentGradientProperty = '% of Households where No Member has Insurance'
            state.datasets.demographic.data.map(region => values.push({
                gid: region.gid,
                data: region.noInsurance
            }))
            return values
    }
}

const getNColor = (color) => {
    return {
        red: {
            min: Math.max(color.minColor.red, color.maxColor.red),
            max: Math.min(color.minColor.red, color.maxColor.red)
        },
        green: {
            min: Math.max(color.minColor.green, color.maxColor.green),
            max: Math.min(color.minColor.green, color.maxColor.green)
        },
        blue: {
            min: Math.max(color.minColor.blue, color.maxColor.blue),
            max: Math.min(color.minColor.blue, color.maxColor.blue)
        }
    }
}

const getRegionColor = (n, nColor) => {
    return {
        red: Math.round(n * (nColor.red.max - nColor.red.min) + nColor.red.min),
        green: Math.round(n * (nColor.green.max - nColor.green.min) + nColor.green.min),
        blue: Math.round(n * (nColor.blue.max - nColor.blue.min) + nColor.blue.min),
    }
}

const addGradientBar = (min, d) => {
    let values = [0, 0.2, 0.4, 0.6, 0.8, 1]

    // Change property name if it already exists in DOM
    if (document.getElementById('gradientProperty'))
        document.getElementById('gradientProperty').textContent = `Gradient Property: ${state.currentGradientProperty}`

    // Add gradient details if it does not exist in DOM
    if (!document.getElementsByClassName('gradientStep').length) {
        // Add gradient property
        let gradientProperty = document.createElement('span')
        gradientProperty.setAttribute('id', 'gradientProperty')
        gradientProperty.textContent = `Gradient Property: ${state.currentGradientProperty}`
        document.getElementsByClassName('gradient')[0].append(gradientProperty)

        // Add gradient bar
        let barDiv = document.createElement('div')
        barDiv.setAttribute('class', 'barDiv')

        values.map(v => {
            let step = document.createElement('div')
            step.setAttribute('class', 'gradientStep')
            let rColor = getRegionColor(v, state.nColor)
            step.style.backgroundColor = `rgb(${rColor.red},${rColor.green},${rColor.blue})`
            barDiv.append(step)
        })

        document.getElementsByClassName('gradient')[0].append(barDiv)
    }

    // Add values beneath color bar
    let gradientValues = values.map(v => Math.round(v * d + min))

    if (document.getElementsByClassName('valuesDiv').length) {
        // Update gradient values
        for (let i = 0; i < document.getElementsByClassName('gradientValue').length; i++) {
            document.getElementsByClassName('gradientValue')[i].textContent = gradientValues[i]
        }

    } else {
        let valuesDiv = document.createElement('div')
        valuesDiv.setAttribute('class', 'valuesDiv')

        gradientValues.map(v => {
            let value = document.createElement('span')
            value.setAttribute('class', 'gradientValue')
            value.textContent = v
            valuesDiv.append(value)
        })

        document.getElementsByClassName('gradient')[0].append(valuesDiv)
    }
}

export const addGradientToMap = () => {
    // Remove regionFill class
    Array.from(document.getElementsByClassName('region')).map(region => region.setAttribute('class', region.getAttribute('class').replace(' regionFill', ' gradientFill')))

    state.gradientData.map(v => {
        let r = Array.from(document.querySelectorAll(`[gid="${v.gid}"]`))
        let rColor = getRegionColor(v.nData, state.nColor)
        r.map(region => region.style.fill = `rgb(${rColor.red},${rColor.green},${rColor.blue})`)
    })
}

export const saveDemographicDataParameters = (event) => {
    event.preventDefault();

    // Get selected parameter
    let param = document.getElementById('demographic-parameter').value;

    // Create array of gid and parameter value
    state.gradientData = getData(param);

    // Normalize the values
    let min = Math.min(...state.gradientData.map(v => v.data)), max = Math.max(...state.gradientData.map(v => v.data)), d = max - min

    for (let i = 0; i < state.gradientData.length; i++) {
        state.gradientData[i].nData = (state.gradientData[i].data - min) / d
    }

    // Normalize colors
    state.nColor = getNColor(state.color)

    // Color to region
    addGradientToMap();
    addGradientBar(min, d);

    snackbar('Demographic data gradient has been set!', 'success');
    closeModal('parameterModal');
}

export const resetDemographicGradient = () => {
    state.gradientData = null
    document.getElementsByClassName('gradient')[0].innerHTML = ''
    Array.from(document.getElementsByClassName('region')).map(region => {
        region.setAttribute('class', region.getAttribute('class').replace(' gradientFill', ' regionFill'))
        region.style.fill = ''
    })

    snackbar('Demographic data gradient has been removed!', 'success');
    closeModal('parameterModal');
}