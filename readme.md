# Our.Umbraco.AnimateOnScroll

Animate element on your page as you scroll.
Based on https://github.com/michalsnik/aos

### Usage / Installation

#### Step 1, umbraco:

1. Create a datatype for `Our.Umbraco.AnimateOnScroll`
2. Add datatype as property name eg: "animate"

#### Step 2, template:


Add AOS css in `<head>`:
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
```


Add script right before closing `</body>` tag, and initialize AOS:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

<script>
  AOS.init();
</script>
```

3. Render html-attributes on element:

```
<section @(Model.Value<Our.Umbraco.AnimateOnScroll.Models.Animation>("animate").ToHtml())>Animated section</<section>
```