import classnames from 'classnames';
import * as React from 'react';
import iconDown = require('./chevron-down.svg');
import iconUp = require('./chevron-up.svg');

type CustomDropdownElem = number | string | React.ReactNode;

interface CustomDropdownProps {
    /**
     * List of options
     */
    list: CustomDropdownElem[];
    /**
     * Selection callback function
     * @default empty
     */
    onSelect?: (index: number) => void;
    /**
     *  By default class name 'cr-dropwdown'
     *  This property gives an additional class name
     *  @default empty
     */
    className?: string;
    /**
     * Value for placeholder of Dropdown components
     * @default empty
     */
    placeholder?: string;
    /**
     * Value for height of Dropdown list elements
     * @default 30px
     */
    elemHeight?: number;
    /**
     * Value for height of Dropdown list
     * @default 90px
     */
    listHeight?: number;
    searched: string;
}

const defaultElemHeight = 30;
const defaultListHeight = 90;

interface DropdownState {
    isOpen: boolean;
    selected: string;
    searchValue: string;
    isTimerRunning: boolean;
    topElem: number;
    isFocused: boolean;
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */
class CustomDropdown extends React.Component<CustomDropdownProps & {}, DropdownState> {
    constructor(props: CustomDropdownProps) {
        super(props);
        this.state = {
            isOpen: false,
            selected: '',
            searchValue: '',
            isTimerRunning: false,
            topElem: 0,
            isFocused: false,
        };
    }
    private scrollAnchorRef = React.createRef<HTMLLIElement>();
    private mainAnchorRef;
    private wrapperRef = React.createRef<HTMLDivElement>();
    private myRef = React.createRef<HTMLInputElement>();

    public componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentWillReceiveProps(next) {
        if (this.props.searched !== next.searched) {
            this.setState({ searchValue: next.searched, selected: next.searched });
        }
    }

    public componentDidUpdate(prev) {
        if (this.state.isOpen) {
            this.scrollToAfterOpening(this.state.selected);
        }
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public render() {
        const { isOpen, isFocused } = this.state;
        const cx = classnames('cr-dropdown', this.props.className);

        return (
            <div className={cx} ref={this.wrapperRef}>
                <div
                    className={`cr-dropdown__input${isFocused ? '--open' : ''}`}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                >
                    <span
                        ref={this.myRef}
                        className="cr-dropdown__input-label"
                        onKeyDown={this.handleKeyPress}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                    >
                        {this.state.selected}
                    </span>
                    <span className="cr-dropdown__input-icon">
                        <img src={isOpen ? iconUp : iconDown} />
                    </span>
                </div>
                {this.renderList(isOpen, this.props.list)}
            </div>
        );
    }

    public scrollToAfterOpening = (searched: string) => {
        const index = this.props.list.findIndex(item => item === searched);
        const elemList = document.querySelectorAll('.cr-dropdown__list-item');
        this.mainAnchorRef = elemList[index];
        this.mainAnchorRef.classList.add('cr-dropdown__list-item-selected');
        this.mainAnchorRef.scrollIntoView({ block: 'center', behavior: 'auto' });
    };

    /**
     * function that handles input value
     * @param e - KeyDown event
     */
    //tslint:disable-next-line
    private handleKeyPress = (e: any) => {
        if (e.type === 'keydown') {
            e.persist();
        }
        this.mainAnchorRef.classList.remove('cr-dropdown__list-item-selected');
        const searched = this.state.selected === this.props.placeholder ? this.props.searched : this.state.selected;
        const selectedElementIndex = this.props.list.indexOf(searched);
        const time = 2000;
        const arrowUpButton = 38;
        const arrowDownButton = 40;
        const enterButton = 13;
        const newValue = `${this.state.searchValue}${e.key}`;

        switch (e.keyCode) {
            case arrowDownButton:
                if (selectedElementIndex < this.props.list.length - 1) {
                    this.setState(
                        {
                            selected: this.convertToString(this.props.list[selectedElementIndex + 1]),
                        },
                        () => this.calculateListShift('down'),
                    );
                }
                break;
            case arrowUpButton:
                if (selectedElementIndex > 0) {
                    this.setState(
                        {
                            selected: this.convertToString(this.props.list[selectedElementIndex - 1]),
                        },
                        () => this.calculateListShift('up'),
                    );
                }
                break;
            case enterButton:
                if (this.state.isOpen) {
                    this.handleSelect(selectedElementIndex);
                    const element = this.myRef.current;
                    element && element.blur();
                    this.setState({
                        isOpen: false,
                        isFocused: false,
                    });
                } else {
                    this.setState({
                        isOpen: true,
                    });
                }
                break;
            default:
                const selectedElem = this.convertToString(this.props.list[this.findOption(newValue, this.props.list)]);
                this.setState(
                    {
                        searchValue: newValue,
                        selected: selectedElem,
                    },
                    () => this.calculateListShift(),
                );
        }
        this.startTimer(time);
        if (e.type === 'keydown') {
            e.preventDefault();
        }
    };

    /**
     * function that handles the selection
     * @param index - number of selected element
     */
    private handleSelect = (index: number) => {
        if (this.props.onSelect) {
            this.props.onSelect(index);
        }
        this.setState({
            selected: this.convertToString(this.props.list[index]),
            isOpen: false,
        });
    };

    private handleFocus = () => {
        this.setState(prevState => ({
            isFocused: true,
            isOpen: true,
        }));
    };

    private handleBlur = () => {
        this.setState(prevState => ({
            isFocused: false,
        }));
    };

    /**
     * function that toggles dropdown list
     */
    private handleClick = () => {
        if (!this.state.isOpen) {
            this.setState(prevState => ({
                isFocused: true,
            }));
        } else {
            const element = this.myRef.current;
            element && element.blur();
        }
    };

    private handleOutsideClick = event => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    };

    /**
     * function that render one element of dropdown list
     * @param option - element
     * @param index - number of element
     */
    private renderOptions = (option: CustomDropdownElem, index: number) => {
        const minOptions = 2;
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const displayedListHeight =
            this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight);
        const shift = this.state.topElem === 0 ? 0 : (displayedListHeight % elemHeight) - this.state.topElem * elemHeight;
        const style = { top: shift, height: elemHeight };
        const cx = classnames('cr-dropdown__list-item', {
            'cr-dropdown__list-item-selected':
                this.convertToString(option) === this.state.selected && this.props.list.length > minOptions,
        });
        return (
            <li
                ref={cx.includes('selected') ? this.scrollAnchorRef : null}
                className={cx}
                key={index}
                onClick={this.handleSelect.bind(this, index)}
                style={style}
            >
                <span className="cr-dropdown__list-item-label">{option}</span>
            </li>
        );
    };

    /**
     * function that render all dropdown list
     * @param listIsOpen - true, if dropdown list is open
     * @param list - list of elements
     */
    private renderList = (listIsOpen: boolean, list: CustomDropdownElem[]) => {
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const height = {
            height: this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight),
        };

        return listIsOpen ? (
            <ul className="cr-dropdown__list" style={height}>
                {list.map(this.renderOptions)}
            </ul>
        ) : (
            ''
        );
    };

    /**
     * function that find option in dropdown list
     * @param value - value for search in list
     * @param list - list of elements
     */
    private findOption = (value: string, list: CustomDropdownElem[]) => {
        for (let i = 0; i < list.length; i++) {
            if (
                this.convertToString(list[i])
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) === 0
            ) {
                return i;
            }
        }
        this.setState({
            searchValue: '',
            isTimerRunning: false,
        });
        return 0;
    };

    /**
     * function that convert element of dropdown list to string
     * @param elem - element
     */
    private convertToString = (elem: CustomDropdownElem) => {
        if (elem !== undefined && elem !== null) {
            return elem.toString();
        }
        return '';
    };

    /**
     * function that start the timer for search value
     */
    private startTimer = (time: number) => {
        if (!this.state.isTimerRunning) {
            this.setState({ isTimerRunning: true });
            setTimeout(() => {
                this.setState({
                    searchValue: '',
                    isTimerRunning: false,
                });
            }, time);
        }
    };

    /**
     * function that calculate shift for dropdown list
     * @param action - arrowUp or arrowDown keypress
     */
    private calculateListShift = (action?: string) => {
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const displayedListHeight =
            this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight);
        const elementsInDisplayedList = Math.floor(displayedListHeight / elemHeight);
        const selectedElem = this.props.list.indexOf(this.state.selected);
        const topElem = this.state.topElem;

        switch (action) {
            case 'down':
                if (
                    selectedElem - topElem >= elementsInDisplayedList &&
                    topElem < this.props.list.length - elementsInDisplayedList
                ) {
                    if (this.scrollAnchorRef.current) {
                        this.scrollAnchorRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
                    }
                }
                break;
            case 'up':
                if (selectedElem >= 0) {
                    if (this.scrollAnchorRef.current) {
                        this.scrollAnchorRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
                    }
                }
                break;
            default:
                if (this.scrollAnchorRef.current) {
                    this.scrollAnchorRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
                }
        }
    };
}

export { CustomDropdown, CustomDropdownProps };
