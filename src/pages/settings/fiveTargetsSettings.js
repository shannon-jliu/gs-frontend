import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import M from 'materialize-css'

import { fromJS } from 'immutable'

import fiveTargetsSettingsOperations from '../../operations/fiveTargetsSettingsOperations.js'

import TextField from './components/TextField.js'
import ShapeSelect from './components/shapeSelect.js'
import ColorSelect from './components/colorSelect.js'

export class fiveTargetsSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targets: [{
                shape: '',
                shapeColor: '',
                letter: '',
                letterColor: ''
            }, {
                shape: '',
                shapeColor: '',
                letter: '',
                letterColor: ''
            }, {
                shape: '',
                shapeColor: '',
                letter: '',
                letterColor: ''
            }, {
                shape: '',
                shapeColor: '',
                letter: '',
                letterColor: ''
            }, {
                shape: '',
                shapeColor: '',
                letter: '',
                letterColor: ''
            }]
        }

        this.getSavedFields = this.getSavedFields.bind(this)
        this.getDisplayFields = this.getDisplayFields.bind(this)
        this.getNewFields = this.getNewFields.bind(this)
        this.canSave = this.canSave.bind(this)
        this.save = this.save.bind(this)
        this.updateSettingsOnInputChange = this.updateSettingsOnInputChange.bind(this)
        this.updateFirstTarget = this.updateFirstTarget.bind(this)
    }

    componentDidMount() {
        let elems = document.querySelectorAll('select')
        M.FormSelect.init(elems, {})
    }

    //add targets 3-5 after confirming this is not scuffed
    //i will clean up the code after maybe probably not if it works it works
    componentDidUpdate(prevProps) {
        if (prevProps.settings.get('settings').get('FirstTarget') !== undefined &&
            prevProps.settings.get('settings').get('SecondTarget') !== undefined &&
            prevProps.settings.get('settings').get('ThirdTarget') !== undefined &&
            prevProps.settings.get('settings').get('FourthTarget') !== undefined &&
            prevProps.settings.get('settings').get('FifthTarget') !== undefined) {

            if (!_.isEqual(prevProps, this.props) && (
                this.props.settings.get('settings').get('FirstTarget').get('shape') !== this.state.FirstTarget.shape &&
                this.props.settings.get('settings').get('FirstTarget').get('shapeColor') !== this.state.FirstTarget.shapeColor &&
                this.props.settings.get('settings').get('FirstTarget').get('letter') !== this.state.FirstTarget.letter &&
                this.props.settings.get('settings').get('FirstTarget').get('letterColor') !== this.state.FirstTarget.letterColor &&

                this.props.settings.get('settings').get('SecondTarget').get('shape') !== this.state.SecondTarget.shape &&
                this.props.settings.get('settings').get('SecondTarget').get('shapeColor') !== this.state.SecondTarget.shapeColor &&
                this.props.settings.get('settings').get('SecondTarget').get('letter') !== this.state.SecondTarget.letter &&
                this.props.settings.get('settings').get('SecondTarget').get('letterColor') !== this.state.SecondTarget.letterColor &&

                this.props.settings.get('settings').get('ThirdTarget').get('shape') !== this.state.ThirdTarget.shape &&
                this.props.settings.get('settings').get('ThirdTarget').get('shapeColor') !== this.state.ThirdTarget.shapeColor &&
                this.props.settings.get('settings').get('ThirdTarget').get('letter') !== this.state.ThirdTarget.letter &&
                this.props.settings.get('settings').get('ThirdTarget').get('letterColor') !== this.state.ThirdTarget.letterColor &&

                this.props.settings.get('settings').get('FourthTarget').get('shape') !== this.state.FourthTarget.shape &&
                this.props.settings.get('settings').get('FourthTarget').get('shapeColor') !== this.state.FourthTarget.shapeColor &&
                this.props.settings.get('settings').get('FourthTarget').get('letter') !== this.state.FourthTarget.letter &&
                this.props.settings.get('settings').get('FourthTarget').get('letterColor') !== this.state.FourthTarget.letterColor &&

                this.props.settings.get('settings').get('FifthTarget').get('shape') !== this.state.FifthTarget.shape &&
                this.props.settings.get('settings').get('FifthTarget').get('shapeColor') !== this.state.FifthTarget.shapeColor &&
                this.props.settings.get('settings').get('FifthTarget').get('letter') !== this.state.FifthTarget.letter &&
                this.props.settings.get('settings').get('FifthTarget').get('letterColor') !== this.state.FifthTarget.letterColor
                //write for the rest of the targets or make another function for this
            )) {
                this.setState({
                    FirstTarget: {
                        shape: this.props.settings.get('settings').get('FirstTarget').get('shape'),
                        shapeColor: this.props.settings.get('settings').get('FirstTarget').get('shapeColor'),
                        letter: this.props.settings.get('settings').get('FirstTarget').get('letter'),
                        letterColor: this.props.settings.get('settings').get('FirstTarget').get('letterColor')
                    },
                    SecondTarget: {
                        shape: this.props.settings.get('settings').get('SecondTarget').get('shape'),
                        shapeColor: this.props.settings.get('settings').get('SecondTarget').get('shapeColor'),
                        letter: this.props.settings.get('settings').get('SecondTarget').get('letter'),
                        letterColor: this.props.settings.get('settings').get('SecondTarget').get('letterColor')
                    },
                    ThirdTarget: {
                        shape: this.props.settings.get('settings').get('ThirdTarget').get('shape'),
                        shapeColor: this.props.settings.get('settings').get('ThirdTarget').get('shapeColor'),
                        letter: this.props.settings.get('settings').get('ThirdTarget').get('letter'),
                        letterColor: this.props.settings.get('settings').get('ThirdTarget').get('letterColor')
                    },
                    FourthTarget: {
                        shape: this.props.settings.get('settings').get('FourthTarget').get('shape'),
                        shapeColor: this.props.settings.get('settings').get('FourthTarget').get('shapeColor'),
                        letter: this.props.settings.get('settings').get('FourthTarget').get('letter'),
                        letterColor: this.props.settings.get('settings').get('FourthTarget').get('letterColor')
                    },
                    FifthTarget: {
                        shape: this.props.settings.get('settings').get('FifthTarget').get('shape'),
                        shapeColor: this.props.settings.get('settings').get('FifthTarget').get('shapeColor'),
                        letter: this.props.settings.get('settings').get('FifthTarget').get('letter'),
                        letterColor: this.props.settings.get('settings').get('FifthTarget').get('letterColor')
                    }
                })
            }

        }
    }

    //im too lazy to write a loop bc idk javascript or react
    getSavedFields() {
        let newLocal = this.props.settings.get('settings')

        if (newLocal.get('FirstTarget') === undefined ||
            newLocal.get('SecondTarget') === undefined ||
            newLocal.get('ThirdTarget') === undefined ||
            newLocal.get('FourthTarget') === undefined ||
            newLocal.get('FifthTarget') === undefined) {
            return {
                FirstTarget: {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                },
                SecondTarget: {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                },
                ThirdTarget: {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                },
                FourthTarget: {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                },
                FifthTarget: {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }
            }
        }
        //TO DO: finish notation for the rest of the targets, maybe make another function
        else {
            let firstShape = newLocal.get('FirstTarget').get('shape') == null ? '' : newLocal.get('FirstTarget').get('shape')
            let firstShapeColor = newLocal.get('FirstTarget').get('shapeColor') == null ? '' : newLocal.get('FirstTarget').get('shapeColor')
            let firstLetter = newLocal.get('FirstTarget').get('letter') == null ? '' : newLocal.get('FirstTarget').get('letter')
            let firstLetterColor = newLocal.get('FirstTarget').get('letterColor') == null ? '' : newLocal.get('FirstTarget').get('letterColor')

            let secondShape = newLocal.get('SecondTarget').get('shape') == null ? '' : newLocal.get('SecondTarget').get('shape')
            let secondShapeColor = newLocal.get('SecondTarget').get('shapeColor') == null ? '' : newLocal.get('SecondTarget').get('shapeColor')
            let secondLetter = newLocal.get('SecondTarget').get('letter') == null ? '' : newLocal.get('SecondTarget').get('letter')
            let secondLetterColor = newLocal.get('SecondTarget').get('letterColor') == null ? '' : newLocal.get('SecondTarget').get('letterColor')

            let thirdShape = newLocal.get('ThirdTarget').get('shape') == null ? '' : newLocal.get('ThirdTarget').get('shape')
            let thirdShapeColor = newLocal.get('ThirdTarget').get('shapeColor') == null ? '' : newLocal.get('ThirdTarget').get('shapeColor')
            let thirdLetter = newLocal.get('ThirdTarget').get('letter') == null ? '' : newLocal.get('ThirdTarget').get('letter')
            let thirdLetterColor = newLocal.get('ThirdTarget').get('letterColor') == null ? '' : newLocal.get('ThirdTarget').get('letterColor')

            let fourthShape = newLocal.get('FourthTarget').get('shape') == null ? '' : newLocal.get('FourthTarget').get('shape')
            let fourthShapeColor = newLocal.get('FourthTarget').get('shapeColor') == null ? '' : newLocal.get('FourthTarget').get('shapeColor')
            let fourthLetter = newLocal.get('FourthTarget').get('letter') == null ? '' : newLocal.get('FourthTarget').get('letter')
            let fourthLetterColor = newLocal.get('FourthTarget').get('letterColor') == null ? '' : newLocal.get('FourthTarget').get('letterColor')

            let fifthShape = newLocal.get('FifthTarget').get('shape') == null ? '' : newLocal.get('FifthTarget').get('shape')
            let fifthShapeColor = newLocal.get('FifthTarget').get('shapeColor') == null ? '' : newLocal.get('FifthTarget').get('shapeColor')
            let fifthLetter = newLocal.get('FifthTarget').get('letter') == null ? '' : newLocal.get('FifthTarget').get('letter')
            let fifthLetterColor = newLocal.get('FifthTarget').get('letterColor') == null ? '' : newLocal.get('FifthTarget').get('letterColor')

            return {
                FirstTarget: {
                    shape: firstShape,
                    shapeColor: firstShapeColor,
                    letter: firstLetter,
                    letterColor: firstLetterColor
                },
                SecondTarget: {
                    shape: secondShape,
                    shapeColor: secondShapeColor,
                    letter: secondLetter,
                    letterColor: secondLetterColor
                },
                ThirdTarget: {
                    shape: thirdShape,
                    shapeColor: thirdShapeColor,
                    letter: thirdLetter,
                    letterColor: thirdLetterColor
                },
                FourthTarget: {
                    shape: fourthShape,
                    shapeColor: fourthShapeColor,
                    letter: fourthLetter,
                    letterColor: fourthLetterColor
                },
                FifthTarget: {
                    shape: fifthShape,
                    shapeColor: fifthShapeColor,
                    letter: fifthLetter,
                    letterColor: fifthLetterColor
                }
            }
        }
    }

    getDisplayFields() {
        return _.merge(this.getSavedFields(), this.state)
    }

    //i think this is fine? check later
    getNewFields() {
        return this.getDisplayFields()
    }

    canSave() {
        let newFields = this.getNewFields()
        let savedFields = this.getSavedFields()

        /*let isValidInput = true 
        const shapes = ["circle","semicircle","quartercircle","triangle","square","rectangle","trapezoid","pentagon","hexagon","octagon","star","cross"];
        const colors = ["white","black","gray","red","blue","green","yellow","purple","brown","orange"];
        const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9"]; //can only be uppercase letter or number

        if (!shapes.includes(newFields.FirstTarget.shape)) isValidInput = false;
        if (!colors.includes(newFields.FirstTarget.color)) isValidInput = false;
        if (!letters.includes(newFields.FirstTarget.shape)) isValidInput = false; */

        return (
            this.props.settings.get('pending').size === 0
            && !_.isEqual(newFields, savedFields)
        )
    }

    save() {
        if (this.canSave()) {
            let newFields = this.getNewFields()
            this.props.updateSettingsStart(newFields)

            this.setState({
                FirstTarget: {
                    shape: '',
                    shapeColor: '',
                    letter: '',
                    letterColor: ''
                },
                SecondTarget: {
                    shape: '',
                    shapeColor: '',
                    letter: '',
                    letterColor: ''
                },
                ThirdTarget: {
                    shape: '',
                    shapeColor: '',
                    letter: '',
                    letterColor: ''
                },
                FourthTarget: {
                    shape: '',
                    shapeColor: '',
                    letter: '',
                    letterColor: ''
                },
                FifthTarget: {
                    shape: '',
                    shapeColor: '',
                    letter: '',
                    letterColor: ''
                }
            })
        }
    }

    /* inputChange(e, newLocal) {
         let value = e.target.value
         if (value === )
     } */

    //TO DO: not changed at all, fix 
    /*updateSettingsOnInputChange(e) {
        let newLocal = _.cloneDeep(this.state)
        //newLocal = this.modeChange(e, newLocal)
        //newLocal = inputChange(e, newLocal)

        this.setState(newLocal)
    } */

    updateSettingsOnInputChange(e) {
        let newState = _.cloneDeep(this.state)
        newState.name = e.target.value
        this.setState(newState)
    }

    updateFirstShapeOnly(e) {
        this.setState({
            FirstTarget: {
                shape: e.target.value,
                shapeColor: 'red'
            }
        })
    }

    updateFirstTarget(e) {
        let newState = _.cloneDeep(this.state)
        let val = e.target.value
        if (e.target.id === 'Shape') {
            newState.FirstTarget.shape = val
        } else if (e.target.id === 'Shape Color') {
            newState.FirstTarget.color = val
        } else if (e.target.id === 'Letter') {
            newState.FirstTarget.letter = val
        } else if (e.target.id === 'Letter Color') {
            newState.FirstTarget.letterColor = val
        }
        this.setState(newState)
    }

    render() {
        let display = this.getDisplayFields()
        let saveClass = !this.canSave() ? 'waves-effect waves-light btn grey' : 'waves-effect waves-light btn'
        return (
            <div className="targets">
                <div className="card white">
                    <div className="card-content">
                        <h3>Targets</h3>
                        <br /> {this.state.targets.map((target) => {
                            return (<>
                                <h6>First Target</h6>
                                <div className="smallerRow">
                                    <ShapeSelect myRef={ref => (this.firstshapeInput = ref)}
                                        onChange={this.updateFirstTarget}
                                        value={target.shape}
                                        title={'Shape'}
                                    />
                                    <ColorSelect myRef={ref => (this.firstShapeColorInput = ref)}
                                        onChange={this.updateFirstTarget}
                                        value={target.shapeColor}
                                        title={'Shape Color'}
                                    />
                                    <TextField myRef={ref => (this.firstLetterInput = ref)}
                                        onChange={this.updateFirstTarget}
                                        value={target.letter}
                                        label={'Letter'}
                                    />
                                    <ColorSelect myRef={ref => (this.firstLetterColorInput = ref)}
                                        onChange={this.updateFirstTarget}
                                        value={target.letterColor}
                                        title={'Letter Color'}
                                    />

                                </div>
                            </>)
                        })}
                    </div>
                </div>
            </div>

        )

    }
}

const mapStateToProps = state => ({
    settings: state.fiveTargetsReducer
})

const mapDispatchToProps = dispatch => ({
    updateSettingsStart: data => fiveTargetsSettingsOperations.updateSettingsStart(dispatch)(fromJS(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(fiveTargetsSettings)