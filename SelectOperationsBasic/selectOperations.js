import { LightningElement, api, track } from "lwc";

export default class SelectOperations extends LightningElement {
  @track items = [];
  @track selectedItems = [];
  @track selectedValues = [];

  isShowSelectionDialog = false;

  connectedCallback() {
    console.log("connectedCallback");
    this.initDate();
  }
  initDate() {
    console.log("initDate");
    try {
      this.items = [];
      this.selectedValues = [];

      var result = [
        { value: 1, label: "Red", isSelected: true },
        { value: 2, label: "Blue", isSelected: false },
        { value: 3, label: "Green", isSelected: true },
        { value: 4, label: "Skyblue", isSelected: false },
        { value: 5, label: "Pink", isSelected: true },
        { value: 6, label: "Brown", isSelected: false },
        { value: 7, label: "Orange", isSelected: true },
        { value: 8, label: "Yellow", isSelected: false }
      ];
      if (result.length > 0) {
        try {
          result.map((resElement) => {
            this.items = [
              ...this.items,
              { value: resElement.value, label: resElement.label }
            ];
            if (resElement.isSelected) {
              this.selectedValues.push(resElement.value);
              this.selectedItems.push(resElement);
            }
          });
          console.log(this.items);
          console.log("value");
          console.log(this.selectedValues);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log("exception initadata");
      console.log(e);
    }
  }

  handleCheckboxChange(event) {
    let selectItemTemp = event.detail.value;
    console.log(" handleCheckboxChange  value=", event.detail.value);
    this.selectedItems = [];
    this.selectedValues = [];

    selectItemTemp.map((p) => {
      let arr = this.items.find((element) => element.value == p);
      if (arr != undefined) {
        this.selectedItems.push(arr);
        this.selectedValues.push(arr.value);
      }
    });
    console.log(" handleCheckboxChange selectedItems=", this.selectedItems);
    console.log(" handleCheckboxChange value=", this.selectedValues);
  }

  handleSelectAllClick(event) {
    console.log(" handleSelectAllClick");
    this.selectedItems = [];
    this.selectedValues = [];

    this.items.map((resElement) => {
      this.selectedItems.push(resElement);
      this.selectedValues.push(resElement.value);
    });
    console.log(" handleSelectAllClick selectedItems=", this.selectedItems);
    console.log(" handleSelectAllClick value=", this.selectedValues);
  }
  handleClearAllClick(event) {
    console.log(" handleClearAllClick");
    this.selectedItems = [];
    this.selectedValues = [];
    console.log(" handleClearAllClick selectedItems=", this.selectedItems);
    console.log(" handleClearAllClick value=", this.selectedValues);
  }

  handleRemoveItemFromSelected(event) {
    const removeItem = event.target.dataset.item;
    this.selectedItems = this.selectedItems.filter(
      (item) => item.value != removeItem
    );
    const arrItems = this.selectedItems;
    this.selectedValues = [];
    this.selectedItems.map((resElement) => {
      this.selectedValues.push(resElement.value);
    });

    const evtCustomEvent = new CustomEvent("remove", {
      detail: { removeItem, arrItems }
    });
    this.dispatchEvent(evtCustomEvent);
  }
  handleCancelClick(event) {
    this.isShowSelectionDialog = false;
  }
  handleSelectButtonClick(event) {
    this.isShowSelectionDialog = true;
  }
}
