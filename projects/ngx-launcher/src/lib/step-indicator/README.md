# Step Indicator Style Information

## Step Indicator Configuration
The Step Indicator area is a complex set of elements that is designed to automatically align and space content evenly inside of the column. Using the CSS Grid system (display: flex for older browsers), each element is positioned along the Step Bar.

### Active Elements and Scrolling
Each Launcher Step ties to a respective anchor tag that is applied to the heading of each section. Accordingly, the content will scroll in a smooth fashion down to the selected element, highlighting (applying the `.active` class) to the proper Step.

In order to connect the header with the proper Step item, each Step Item must have a unique ID assigned to it, included in the `<a>`.
```html
<a href="javascript:void(0)" class="f8launcher-vertical-bar_steps--item" (click)="selectSection('UniqueHeaderID')" [class.active]="launcherComponent.selectedSection === 'UniqueHeaderID'">
```
If a heading does not have a unique ID, or a Step is given a duplicate ID, then clicking on a Launcher Step will not bring the user to the expected section.

## Step Bar Configuration

### Show step bar in an unfinished state

To show the step bar (what the step indicator circles line up with) in an unfinished state, add the class `.in-progress` to `<div class="f8launcher-vertical-bar">`. This will give the step bar a gradient style, where the bottom end will fade into the vertical navigation background.

---

## Hiding and Showing Launcher Steps

To hide and/or show steps in the step indicator, all one needs to do is add or remove the class `.hide` from the element `<a>`. There is an existing class on all `<a>` that this needs to be added after.

### Hide a Step
  - add `.hide`
```html
<a href="javascript:void(0)" class="f8launcher-vertical-bar_steps--item hide">
```

### Show a Step
  - remove `.hide`
```html
<a href="javascript:void(0)" class="f8launcher-vertical-bar_steps--item">
```
