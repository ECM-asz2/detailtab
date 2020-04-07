import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import { Grid, GridCell } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { DetailTabJSLib } from "../../external/detailTabJSLib.js";

const SELECTED_CONTRACT_TYPE = 'Dienstleistungsvertrag';
const ID_DAILY_RATE_CONSULTANT = 72;
const ID_DAILY_RATE_PROJECT_LEADER = 71;

class DetailTabClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dailyRateConsultant: undefined,
            dailyRateProjectLeader: undefined,
            contractType: ""
        }
        dapi.publishTitle(this.props.t("common:TITLE"))
    }
    
    dt = new DetailTabJSLib()

    componentDidMount(props) {
        this.dt.registerForDataChange(this.onContractChanged);
        this.dt.setTitle(this.props.t("common:TITLE"));
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState.contractType !== this.state.contractType){
            this.dt.setVisibilityOfTab(this.state.contractType === SELECTED_CONTRACT_TYPE);
        }
    }

    componentWillReceiveProps(nextProps) {
    }
    
    onContractChanged = (event)=>{
        if(event.data != undefined){
            if(event.data.advMasterData != undefined && event.data.advMasterData.additionalSingleValueData != undefined){
                if(event.data.advMasterData.additionalSingleValueData[ID_DAILY_RATE_CONSULTANT] != undefined){
                    this.setState({dailyRateConsultant: event.data.advMasterData.additionalSingleValueData[ID_DAILY_RATE_CONSULTANT]});
                }
                if(event.data.advMasterData.additionalSingleValueData[ID_DAILY_RATE_PROJECT_LEADER] != undefined){
                    this.setState({dailyRateProjectLeader: event.data.advMasterData.additionalSingleValueData[ID_DAILY_RATE_PROJECT_LEADER]});
                }
                if(event.data.masterData.type != undefined){
                    this.setState({contractType: event.data.masterData.type});
                }
            }
        }
    }
    
    changedDailyRateConsultant = (newVal) => {
        this.setState({dailyRateConsultant: newVal.target.value});
        this.dt.updateData({advMasterData: {additionalSingleValueData: {[ID_DAILY_RATE_CONSULTANT]: newVal.target.value}}});
    }
    
    changedDailyRateProjectLeader = (newVal) => {
        this.setState({dailyRateProjectLeader: newVal.target.value});
        this.dt.updateData({advMasterData: {additionalSingleValueData: {[ID_DAILY_RATE_PROJECT_LEADER]: newVal.target.value}}});
    }

    render() {
        return (
            <Grid>
                <GridCell desktop="6" phone="4">
                    <TextField style={{ width: "100%" }} label={this.props.t("common:DALY_RATE_PROJECT_LEADER")} onChange={this.changedDailyRateProjectLeader}
                        value={this.state.dailyRateProjectLeader} />
                </GridCell>
                <GridCell desktop="6" phone="4">
                    <TextField style={{ width: "100%" }} label={this.props.t("common:DALY_RATE_CONSULTANT")} onChange={this.changedDailyRateConsultant}
                        value={this.state.dailyRateConsultant} />
                </GridCell>
            </Grid>
        );
    }
}

const mapPropsToDispatch = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
};
const mapStoreToProps = (store, ownProps) => ({
    ...ownProps
});

const DetailTab = connect(mapStoreToProps, mapPropsToDispatch)(withTranslation()(DetailTabClass));
export default DetailTab;