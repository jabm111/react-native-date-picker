import React, {
    Platform,
    Component,
    Modal,
    View,
    DatePickerIOS,
    DatePickerAndroid,
    TouchableHighlight,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
const WIN = Dimensions.get('window');

export default class CustomDatePicker extends Component {
    constructor(props) {
        super(props);

        this.isReady = false;

        this.state = {
            selectedDate: null,
            minDate: null,
            maxDate: null,
            showModal: false
        };

        this.initComponent = this.initComponent.bind(this);
        this.openDatePicker = this.openDatePicker.bind(this);
        this.openIOSDatePicker = this.openIOSDatePicker.bind(this);
        this.openAndroidDatePicker = this.openAndroidDatePicker.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.renderModalIOS = this.renderModalIOS.bind(this);
        this.handlePressDone = this.handlePressDone.bind(this);
        this.handlePressCancel = this.handlePressCancel.bind(this);
    }

    componentDidMount() {
        this.initComponent();
    }

    initComponent() {
        const selectedDate = this.props.initialDate ? this.props.initialDate : new Date();
        const minDate = this.props.minDate ? this.props.minDate : new Date(1900, 1, 1);
        const maxDate = this.props.maxDate ? this.props.maxDate : new Date();

        this.setState({
            selectedDate,
            minDate,
            maxDate
        });

        this.isReady = true;
    }

    openIOSDatePicker() {
        this.setState({ showModal: true });
    }

    openAndroidDatePicker() {
        DatePickerAndroid.open({
            date: this.state.selectedDate,
            minDate: this.state.minDate,
            maxDate: this.state.maxDate
        })
        .then((result) => {
            if (result.action === DatePickerAndroid.dateSetAction) {
                const selectedDate = new Date(result.year, result.month, result.day);

                this.setState({ selectedDate });
                this.props.onDone(selectedDate);
            } else if (result.action === DatePickerAndroid.dismissedAction) {
                this.props.onCancel ? this.props.onCancel() : null;
            }
        });
    }

    openDatePicker() {
        if (!this.isReady) {
            return;
        }

        if (Platform.OS === 'ios') {
            this.openIOSDatePicker();
        } else if (Platform.OS === 'android') {
            this.openAndroidDatePicker();
        }
    }

    handlePressDone() {
        this.setState({ showModal: false });
        this.props.onDone(this.state.selectedDate);
    }

    handlePressCancel() {
        this.setState({ showModal: false });
        this.props.onCancel ? this.props.onCancel() : null;
    }

    handleDateChange(selectedDate) {
        this.setState({ selectedDate });
    }

    renderModalIOS() {
        if (Platform.OS === 'ios') {
            return (
                <Modal
                    animated
                    transparent
                    visible={this.state.showModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <TouchableHighlight
                                    style={styles.cancel}
                                    underlayColor={'transparent'}
                                    onPress={this.handlePressCancel}
                                >
                                    <Text style={styles.text}>{this.props.cancelText}</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.btn}>
                                <TouchableHighlight
                                    style={styles.done}
                                    underlayColor={'transparent'}
                                    onPress={this.handlePressDone}
                                >
                                    <Text style={styles.text}>{this.props.doneText}</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <DatePickerIOS
                            style={styles.datePickerIOS}
                            date={this.state.selectedDate}
                            mode={'date'}
                            minimumDate={this.state.minDate}
                            maximumDate={this.state.maxDate}
                            onDateChange={(date) => this.handleDateChange(date)}
                        />
                    </View>
                </Modal>
            );
        }

        return null;
    }

    render() {
        return (
            <View>
                {this.renderModalIOS()}
                <TouchableHighlight onPress={this.openDatePicker} underlayColor={'transparent'}>
                    {this.props.children}
                </TouchableHighlight>
            </View>
        );
    }
}

CustomDatePicker.propTypes = {
    onDone: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    initialDate: React.PropTypes.instanceOf(Date),
    minDate: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    cancelText: React.PropTypes.string,
    doneText: React.PropTypes.string
};

CustomDatePicker.defaultProps = {
    cancelText: 'Cancel',
    doneText: 'Done'
};

const styles = StyleSheet.create({
    modalContainer: {
        width: WIN.width,
        height: WIN.height,
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    btnContainer: {
        width: WIN.width,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: 'lightgray',
        paddingTop: 10
    },
    datePickerIOS: {
        backgroundColor: 'white'
    },
    btn: {
        flex: 1,
        paddingHorizontal: 15
    },
    cancel: {
        alignItems: 'flex-start'
    },
    done: {
        alignItems: 'flex-end'
    },
    text: {
        color: '#138BE4'
    }
});
