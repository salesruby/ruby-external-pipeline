<!DOCTYPE html>
<html lang="en">
<head>
    <title>Plugin Development</title>
    <style type="text/css">
        .wrapper {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            padding-top: 50px;
            font-weight: 800;
            color: blue;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <h1 class="header">Rubystack External Plugin Integration</h1>
    <div id="ruby_pipeline"></div>
</div>

<script type="text/javascript" src="ruby-pipeline-script-v1.js"></script>
<script type="text/javascript">
    let rubyForm = new RubyForm({
        key : "a7938bf859ce7b405d28e86d50f069c5"
    });
    rubyForm.init();
</script>
</body>
</html>
