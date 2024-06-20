import { useEffect } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  FlatList,
} from "react-native";
import {
  Checkbox,
  Divider,
  Menu,
  TextInput,
  TouchableRipple,
  useTheme,
  Text,
} from "react-native-paper";
import React, {
  ReactNode,
  forwardRef,
  useState,
  useCallback,
  Fragment,
} from "react";
import { Theme } from "react-native-paper/lib/typescript/types";

const { useUpdate } = require("@hashiprobr/react-use-mount-and-update");

export interface DropDownPropsInterface {
  multiSelect?: boolean;
  value: any;
  onChangeValue: (_value: any) => void;
  label?: string | undefined;
  placeholder?: string | undefined;
  mode?: "outlined" | "flat" | undefined;
  list: Array<{
    label: string;
    value: string | number;
    custom?: ReactNode;
  }>;
  dropDownContainerMaxHeight?: number;
  dropDownContainerHeight?: number;
  activeColor?: string;
  theme?: Theme;
  dropDownStyle?: ViewStyle;
  dropDownItemSelectedTextStyle?: TextStyle;
  dropDownItemSelectedStyle?: ViewStyle;
  dropDownItemStyle?: ViewStyle;
  dropDownItemTextStyle?: TextStyle;
  accessibilityLabel?: string;
  disabled?: boolean;
  onFocus?: (_value: any) => void;
  onBlur?: (_value: any) => void;
  style?: any;
  editable?: boolean;
  borderless?: boolean;
  background?: object;
  centered?: boolean;
  rippleColor?: string;
  underlayColor?: string;
  touchableStyle?: any;
  error?: boolean;
  selectionColor?: string;
  underlineColor?: string;
  activeUnderlineColor?: string;
  outlineColor?: string;
  activeOutlineColor?: string;
  dense?: boolean;
  iconColor?: string;
  iconStyle?: any;
}

const DropDown = forwardRef<TouchableWithoutFeedback, DropDownPropsInterface>(
  (props, ref) => {
    const activeTheme = useTheme();
    const {
      multiSelect = false,
      value,
      onChangeValue,
      activeColor,
      mode,
      label,
      placeholder,
      list,
      dropDownContainerMaxHeight,
      dropDownContainerHeight,
      theme,
      dropDownStyle,
      dropDownItemStyle,
      dropDownItemSelectedStyle,
      dropDownItemTextStyle,
      dropDownItemSelectedTextStyle,
      accessibilityLabel,
      disabled,
      onFocus = () => {},
      onBlur = () => {},
      style = {},
      editable,
      borderless,
      background,
      centered,
      rippleColor,
      underlayColor,
      touchableStyle,
      error,
      selectionColor,
      underlineColor,
      activeUnderlineColor,
      outlineColor,
      activeOutlineColor,
      dense,
      iconColor,
      iconStyle,
    } = props;
    const flatListRef = React.useRef<FlatList | null>(null);
    const [displayValue, setDisplayValue] = useState("");
    const [inputLayout, setInputLayout] = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    });
    const [visible, setVisible] = useState(false);

    const onDismiss = () => {
      setVisible(false);
    };

    const showDropDown = () => {
      if (editable !== false) {
        setVisible(true);
      }
    };

    const onLayout = (event: LayoutChangeEvent) => {
      setInputLayout(event.nativeEvent.layout);
    };

    const findInitialIndex = () => {
      let index: number = 0;
      if (multiSelect) {
        index = list.findIndex((_) => value.indexOf(_.value) !== -1);
      } else {
        index = list.findIndex((_) => _.value === value);
      }
      return index == -1 ? 0 : index;
    };

    useEffect(() => {
      if (visible) {
        let index: number = 0;
        if (multiSelect) {
          index = list.findIndex((_) => value.indexOf(_.value) !== -1);
        } else {
          index = list.findIndex((_) => _.value === value);
        }

        setTimeout(
          () =>
            flatListRef.current?.scrollToIndex({
              index: index == -1 ? 0 : index,
              animated: false,
            }),
          200
        );
      }
    }, [visible]);

    useUpdate(() => {
      if (multiSelect) {
        const _labels = list
          .filter((_) => value.indexOf(_.value) !== -1)
          .map((_) => _.label)
          .join(", ");
        setDisplayValue(_labels);
      } else {
        const _label = list.find((_) => _.value === value)?.label;
        if (_label) {
          setDisplayValue(_label);
        } else {
          setDisplayValue("");
        }
      }
    }, [list, value]);

    const isActive = useCallback(
      (currentValue: any) => {
        if (multiSelect) {
          return value.indexOf(currentValue) !== -1;
        } else {
          return value === currentValue;
        }
      },
      [value]
    );

    const setActive = useCallback(
      (currentValue: any) => {
        if (multiSelect) {
          const valueIndex = value.indexOf(currentValue);
          const values = value.split(",");
          if (valueIndex === -1) {
            onChangeValue([...values, currentValue].join(","));
          } else {
            onChangeValue(
              [...values].filter((value) => value !== currentValue).join(",")
            );
          }
        } else {
          onChangeValue(currentValue);
        }
      },
      [value]
    );

    return (
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        theme={theme}
        anchor={
          <TouchableRipple
            ref={ref}
            onPress={showDropDown}
            onLayout={onLayout}
            accessibilityLabel={accessibilityLabel}
            onFocus={onFocus}
            onBlur={onBlur}
            borderless={borderless}
            background={background}
            centered={centered}
            disabled={disabled}
            rippleColor={rippleColor}
            underlayColor={underlayColor}
            style={{
              ...touchableStyle,
              flexGrow: 1,
              flexDirection: "column",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "stretch",
              margin: style.margin,
              marginTop: style.marginTop,
              marginRight: style.marginRight,
              marginBottom: style.marginBottom,
              marginLeft: style.marginLeft,
              padding: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              overflow: "visible",
            }}
            theme={theme}
          >
            <View
              pointerEvents={"none"}
              style={{
                flexGrow: 1,
              }}
            >
              <TextInput
                value={displayValue}
                mode={mode}
                label={label}
                placeholder={placeholder}
                pointerEvents={"none"}
                theme={theme}
                right={
                  <TextInput.Icon
                    name={visible ? "menu-up" : "menu-down"}
                    disabled={disabled}
                    forceTextInputFocus={false}
                    color={iconColor}
                    style={iconStyle}
                    theme={theme}
                  />
                }
                disabled={disabled}
                error={error}
                selectionColor={selectionColor}
                underlineColor={underlineColor}
                activeUnderlineColor={activeUnderlineColor}
                outlineColor={outlineColor}
                activeOutlineColor={activeOutlineColor}
                dense={dense}
                multiline={false}
                numberOfLines={1}
                style={{
                  ...style,
                  flexGrow: 1,
                  alignSelf: "stretch",
                  margin: 0,
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 0,
                }}
                editable={false}
              />
            </View>
          </TouchableRipple>
        }
        style={{
          maxWidth: inputLayout?.width,
          width: inputLayout?.width,
          marginTop: inputLayout?.height,
          ...dropDownStyle,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={list}
          getItemLayout={(_, index) => ({
            length: 45,
            offset: 45 * index,
            index,
          })}
          renderItem={({ item: _item, index: _index }) => (
            <Fragment key={_item.value}>
              <TouchableRipple
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setActive(_item.value);
                  if (onDismiss) {
                    onDismiss();
                  }
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      paddingTop: 6,
                      minHeight: 45,
                      paddingLeft: 16,
                      color: isActive(_item.value)
                        ? activeColor || (theme || activeTheme).colors.primary
                        : (theme || activeTheme).colors.text,
                      ...(isActive(_item.value)
                        ? dropDownItemSelectedTextStyle
                        : dropDownItemTextStyle),
                    }}
                  >
                    {_item.custom || _item.label}
                  </Text>
                  {multiSelect && (
                    <Checkbox.Android
                      theme={{
                        colors: { accent: activeTheme?.colors.primary },
                      }}
                      status={isActive(_item.value) ? "checked" : "unchecked"}
                      onPress={() => setActive(_item.value)}
                    />
                  )}
                </View>
              </TouchableRipple>
              <Divider />
            </Fragment>
          )}
          keyExtractor={(_item) => _item.value.toString()}
          style={{
            ...(dropDownContainerHeight
              ? {
                  height: dropDownContainerHeight,
                }
              : {
                  maxHeight: dropDownContainerMaxHeight || 200,
                }),
          }}
        />
      </Menu>
    );
  }
);

export default DropDown;
