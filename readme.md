### Rubystack External Pipeline Generator
This is a self-independent script that generates lead generation form from
any external source to Rubystack application.

## Usage
include the script before the closing ```<body>``` tag of your website
```html
<sript type="text/javascript" src="https://cdn.jsdelivr.net/gh/olubunmitosin/ruby-external-pipeline/dist/ruby-pipeline.js"></script>
```

Add the following markup in any page you want the form to show up
```html
<div id="ruby_pipeline"></div>
```

Init the script like so;
```html
<script type="text/javascript">
    let rubyForm = new RubyForm({
        key : "your_rubystack_api_key"
    });
    rubyForm.init();
</script>
```

#### Made with love by Kesty
