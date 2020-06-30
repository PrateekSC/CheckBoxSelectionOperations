import { LightningElement, wire, api, track } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from "c/pubsub";

import findColors from "@salesforce/apex/ContactController.findColors";

export default class SelectOperations extends LightningElement {
  @track items = [];
  @track selectedItems = [];
  @wire(CurrentPageReference) pageRef;

  isShowSelectionDialog = false;
  searchInput = "";

  connectedCallback() {
    this.initDate();
  }
  initDate() {
    try {
      this.items = [];
    } catch (e) {
      console.log("exception initadata");
      console.log(e);
    }
  }

  handleInputCheckboxChange(event) {
    if (event.target.checked) {
      let arr = this.items.find(
        (element) => element.value == event.target.value
      );
      let arrSelected = this.selectedItems.find(
        (element) => element.value == event.target.value
      );
      if (arr != undefined && arrSelected == undefined) {
        arr.isSelected = true;
        this.selectedItems.push(arr);
      }
    } else {
      let arr = this.items.find(
        (element) => element.value == event.target.value
      );
      let arrSelected = this.selectedItems.find(
        (element) => element.value == event.target.value
      );
      if (arr != undefined && arrSelected != undefined) {
        arr.isSelected = false;
        this.selectedItems = this.selectedItems.filter(
          (item) => item.value != event.target.value
        );
      }
    }
    this.broadcastSelectedItem();
  }

  handleSelectAllClick(event) {
    this.items.map((resElement) => {
      let arr = this.selectedItems.find(
        (element) => element.value == resElement.value
      );
      if (arr == undefined) {
        resElement.isSelected = true;
        this.selectedItems.push(resElement);
      }
    });
    this.broadcastSelectedItem();
  }
  handleClearAllClick(event) {
    this.selectedItems = [];
    this.items.map((resElement) => {
      resElement.isSelected = false;
    });
    this.broadcastSelectedItem();
  }

  handleRemoveItemFromSelected(event) {
    const removeItem = event.target.dataset.item;
    this.selectedItems = this.selectedItems.filter(
      (item) => item.value != removeItem
    );
    this.broadcastSelectedItem();
  }
  handleCancelClick(event) {
    this.isShowSelectionDialog = false;
    this.searchInput = "";
    this.items = [];
  }
  handleSelectButtonClick(event) {
    this.isShowSelectionDialog = true;
    this.searchInput = "";
    this.items = [];
  }

  onchangeSearchInput(event) {
    this.searchInput = event.target.value;
    if (this.searchInput.trim().length > 0) {
      findColors({ strInput: this.searchInput })
        .then((result) => {
          this.items = [];
          if (result.length > 0) {
            result.map((resElement) => {
              this.items = [
                ...this.items,
                {
                  value: resElement.value__c,
                  label: resElement.label__c,
                  isSelected: false
                }
              ];
            });
            this.selectedItems.map((element) => {
              let arr = this.items.find(
                (itemEle) => itemEle.value == element.value
              );
              if (arr != undefined) {
                arr.isSelected = true;
              }
            });
            this.isDisplayMessage = false;
          } else {
            this.isDisplayMessage = true;
          }
        })
        .catch((error) => {
          this.error = error;
          this.items = [];
          this.isShowSelectionDialog = false;
        });
    }
  }
  broadcastSelectedItem() {
    console.log(
      "SelectOprations: fireEvent:colorSelectedItemsEvent",
      this.selectedItems
    );
    fireEvent(this.pageRef, "colorSelectedItemsEvent", this.selectedItems);

    const evtCustomEvent = new CustomEvent("selectedItemsCB", {
      detail: this.selectedItems
    });
    this.dispatchEvent(evtCustomEvent);
  }
}
