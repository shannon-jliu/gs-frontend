import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import M from 'materialize-css'

import { fromJS } from 'immutable'

import fiveTargetsSettingsOperations from '../../operations/fiveTargetsSettingsOperations.js'
import TargetOperations from '../../operations/targetOperations'

import ShapeSelect from './components/shapeSelect.js'
import ColorSelect from './components/colorSelect.js'
import LetterSelect from './components/letterSelect.js'

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
        this.updateTargetInformation = this.updateTargetInformation.bind(this)
    }

    componentDidMount() {
        let elems = document.querySelectorAll('select')
        M.FormSelect.init(elems, {})
    }

    // Checks if any of the previous and current values are the same, returns true if they aren't the same
    compareValues(x) {
        let check = true;
        for (var i = 0; i < x.length; i++) {
            if (x[i].shape === this.state.targets[i].shape) check = false;
            if (x[i].shapeColor === this.state.targets[i].shapeColor) check = false;
            if (x[i].letter === this.state.targets[i].letter) check = false;
            if (x[i].letterColor === this.state.targets[i].letterColor) check = false;
        }
        return check;
    }

    componentDidUpdate(prevProps) {
        let targets = this.props.settings.get('settings').get('targets')
        if (prevProps.settings.get('settings').get('targets') !== undefined) {
            if (!_.isEqual(prevProps, this.props) && this.compareValues(targets)) {
                this.setState({
                    targets: [{
                        shape: this.props.settings.get('settings').get('targets')[0].shape,
                        shapeColor: this.props.settings.get('settings').get('targets')[0].shapeColor,
                        letter: this.props.settings.get('settings').get('targets')[0].letter,
                        letterColor: this.props.settings.get('settings').get('targets')[0].letterColor
                    }, {
                        shape: this.props.settings.get('settings').get('targets')[1].shape,
                        shapeColor: this.props.settings.get('settings').get('targets')[1].shapeColor,
                        letter: this.props.settings.get('settings').get('targets')[1].letter,
                        letterColor: this.props.settings.get('settings').get('targets')[1].letterColor
                    }, {
                        shape: this.props.settings.get('settings').get('targets')[2].shape,
                        shapeColor: this.props.settings.get('settings').get('targets')[2].shapeColor,
                        letter: this.props.settings.get('settings').get('targets')[2].letter,
                        letterColor: this.props.settings.get('settings').get('targets')[2].letterColor
                    }, {
                        shape: this.props.settings.get('settings').get('targets')[3].shape,
                        shapeColor: this.props.settings.get('settings').get('targets')[3].shapeColor,
                        letter: this.props.settings.get('settings').get('targets')[3].letter,
                        letterColor: this.props.settings.get('settings').get('targets')[3].letterColor
                    }, {
                        shape: this.props.settings.get('settings').get('targets')[4].shape,
                        shapeColor: this.props.settings.get('settings').get('targets')[4].shapeColor,
                        letter: this.props.settings.get('settings').get('targets')[4].letter,
                        letterColor: this.props.settings.get('settings').get('targets')[4].letterColor
                    }]
                })
            }

        }
    }

    AssignUndefined(x) {
        let targets = [{shape: '', shapeColor: '', letter: '', letterColor: ''}, 
            {shape: '', shapeColor: '', letter: '', letterColor: ''}, 
            {shape: '', shapeColor: '', letter: '', letterColor: ''}, 
            {shape: '', shapeColor: '', letter: '', letterColor: ''}, 
            {shape: '', shapeColor: '', letter: '', letterColor: ''}]

        for (var i = 0; i < x.length; i++) { 
            if (x[i].shape !== null) targets[i].shape = x[i].shape
            if (x[i].shapeColor !== null) targets[i].shapeColor = x[i].shapeColor
            if (x[i].letter !== null) targets[i].shape = x[i].letter
            if (x[i].letterColor !== null) targets[i].shape = x[i].letterColor
        }

        return targets;
    }

    getSavedFields() {
        let newLocal = this.props.settings.get('settings')
        if (newLocal.get('targets') === undefined) {
            return {
                targets: [{
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }, {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }, {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }, {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }, {
                    shape: null,
                    shapeColor: null,
                    letter: null,
                    letterColor: null
                }]
            }
        }
        else {
            return this.AssignUndefined(newLocal.get('targets'))
        }
    }

    getDisplayFields() {
        return _.merge(this.getSavedFields(), this.state)
    }

    getNewFields() {
        return this.getDisplayFields()
    }

    //getting pending is not 0 after saving? 
    canSave() {
        let newFields = this.getNewFields()
        let savedFields = this.getSavedFields()

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
            })
        }
    }

    updateTargetInformation(evt, target, index, x) {
        let newState = _.cloneDeep(this.state)
        let val = evt.target.value
        if (x == 1) newState.targets[index].shapeColor = val
        if (x == 2) newState.targets[index].shape = val
        if (x == 3) newState.targets[index].letterColor = val
        if (x == 4) newState.targets[index].letter = val
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
                        <br /> {this.state.targets.map((target, index) => {
                            return (<>
                                <h5>Target #{index + 1}</h5>
                                <div className="smallerRow">

                                    <div className="shapeColor">
                                        <ColorSelect
                                            onChange={(evt) => this.updateTargetInformation(evt, target, index, 1)}
                                            value={target.shapeColor}
                                            title={'Shape Color'}
                                        />
                                    </div>

                                    <div className="shape">
                                        <ShapeSelect
                                            onChange={(evt) => this.updateTargetInformation(evt, target, index, 2)}
                                            value={target.shape}
                                            title={'Shape'}
                                        />
                                    </div>

                                    <div className="letterColor">
                                        <ColorSelect
                                            onChange={(evt) => this.updateTargetInformation(evt, target, index, 3)}
                                            value={target.letterColor}
                                            title={'Letter Color'}
                                        />
                                    </div>

                                    <div className="letter">
                                        <LetterSelect
                                            onChange={(evt) => this.updateTargetInformation(evt, target, index, 4)}
                                            value={target.letter}
                                            title={'Letter'}
                                        />
                                    </div>


                                </div>
                            </>)
                        })}
                        <div className="obj">
                            <button onClick={this.save} className={saveClass}>
                                Save
                            </button>
                        </div>
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