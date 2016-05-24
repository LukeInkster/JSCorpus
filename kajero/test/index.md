---
title: Sample Kajero notebook
author: Joel Auterson
created: Mon Apr 18 2016 21:48:01 GMT+0100 (BST)
datasources:
    joelotter: https://api.github.com/users/joelotter/repos
    popular: https://api.github.com/search/repositories?q=created:>2016-01-01&sort=stars&order=desc
    extra: https://api.github.com/search/repositories?q=created:>2016-01-01&sort=stars&order=desc&per_page=100
original:
    title: Blank Kajero notebook
    url: http://www.joelotter.com/kajero/blank
show_footer: true
---

This is an example of a notebook written in **Kajero**. Hopefully it'll give you a bit of insight into what Kajero is, and what you might be able to use it for!

Kajero is designed to make it really easy for anyone to create good-looking, responsive, data-rich documents. They're totally viewable in a web browser - no backend necessary beyond what's needed to host the page - and can contain interactive code samples, written in JavaScript.

They've also got some nice graphing and data visualisation capabilities - we'll look at that in a bit.

(If you were wondering, _'kajero'_ is the Esperanto word for _'notebook'_.)

Let's have a look at some features.

## It's just Markdown

Go ahead and take a look at the [page source](view-source:http://www.joelotter.com/kajero). You'll notice that the notebook is really just a Markdown document with some bookending HTML tags - it's the Kajero script that does all the work of rendering. You've got all the usability of Markdown to play with.

- You
- can
- make
- lists!

\[ Escapes work \]

There is also inline code, like `console.log('thing')`.

<i>HTML is allowed, as per the Markdown spec.</i>

<pre style="width: 50%;"><code>print "You can use inline HTML to get styling, which is neat.</code></pre>

```python
print "You can have code, with syntax highlighting."
print "This is Python - it can't be run in the browser."
```

```javascript; runnable
return "Javascript can be, though. Click play!";
```

Because it's just Markdown, and all the work is done by a script in the browser, it's really easy for users to create new notebooks from scratch. But you might not want to create from scratch, so...

## Every notebook is editable

You might have noticed the little pencil icon in the top-right. Give it a poke! You'll find yourself in the editor interface. Every single Kajero notebook is fully editable right in the browser. Once you've made your changes, you can export it as a new HTML or Markdown document.

The notebooks also contain a link to their parent page. It's in the footer of this page if you want to have a look! If users don't want this footer, it can be turned off in the editor.

This is all very well, but the notebooks are supposed to be _interactive_.

## Running code

Authors need to be able to put code samples in their documents. If these samples are in JavaScript, they can be run by the users. Here's a very simple example, which squares and sums the numbers up to 10.

```javascript; runnable
var result = 0;
for (var i = 1; i <= 10; i++) {
    result += i * i;
}
return result;
```

Code samples are written (and run) as functions, and the function's returned value is displayed to the user in the box below the code. What if we want to share information between code samples, though?

In Kajero, the keyword **this** refers to the global context, which is passed around between samples. We can assign something onto the context, and then access it in another sample.

```javascript; runnable
this.number = 100;
return this.number;
```

We can now sum the squares of numbers up to the number we defined in the previous code block.

```javascript; runnable
var result = 0;
for (var i = 10; i <= this.number; i++) {
    result += i * i;
}
return result;
```

```javascript; runnable
this.number *= 2;
return this.number;
```

Try playing around with running these code samples in different orders, to see how the results change.

## Working with data

If you had a look in the editor, you'll have noticed that users can define _data sources_ - these are URLs of public JSON data. This data is automatically fetched, and put into the **data** object, which is made available in code samples.

The **joelotter** data source is my GitHub repository information. Let's get the names of my repositories.

```javascript; runnable
return data.joelotter.map(function(repo) {
    return repo.name;
});
```

You'll notice that Kajero can visualise whatever data you throw at it - it's not just strings and numbers! Here's the whole of my repository data to demonstrate.

```javascript; runnable
return data.joelotter;
```

This isn't necessarily the most attractive or user-friendly way to look at data, though.

## Graphs

Kajero gives users access to [d3](https://d3js.org/), the web's favourite graphing library.

```javascript; runnable
// Remove any old SVGs for re-running
d3.select(graphElement).selectAll('*').remove();

var sampleSVG = d3.select(graphElement)
    .append("svg")
    .attr("width", 100)
    .attr("height", 100);

sampleSVG.append("circle")
    .style("stroke", "gray")
    .style("fill", "white")
    .attr("r", 40)
    .attr("cx", 50)
    .attr("cy", 50)
    .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
    .on("mouseout", function(){d3.select(this).style("fill", "white");})
    .on("mousedown", animateFirstStep);

function animateFirstStep(){
    d3.select(this)
      .transition()
        .delay(0)
        .duration(1000)
        .attr("r", 10)
        .each("end", animateSecondStep);
};

function animateSecondStep(){
    d3.select(this)
      .transition()
        .duration(1000)
        .attr("r", 40);
};

return "Try clicking the circle!";
```

Users get access to **d3**, which is the library itself, and **graphElement**, which is a reference to the element where the graph is drawn.

d3 is incredibly powerful, but may be too complex for many users. To help out with this, Kajero also includes [NVD3](http://nvd3.org/), which provides some nice pre-built graphs for d3. The code below generates a random scatter graph - try it!

```javascript; runnable
d3.select(graphElement).selectAll('*').remove();
d3.select(graphElement).append('svg').attr("width", "100%");

nv.addGraph(function() {
    var chart = nv.models.scatter()
        .margin({top: 20, right: 20, bottom: 20, left: 20})
        .pointSize(function(d) { return d.z })
        .useVoronoi(false);
    d3.select(graphElement).selectAll("svg")
        .datum(randomData())
        .transition().duration(500)
        .call(chart);
    nv.utils.windowResize(chart.update);
    return chart;
});

function randomData() {
    var data = [];
    for (i = 0; i < 2; i++) {
        data.push({
            key: 'Group ' + i,
            values: []
        });
        for (j = 0; j < 100; j++) {
            data[i].values.push({x: Math.random(), y: Math.random(), z: Math.random()});
        }
    }
    return data;
}
return "Try clicking the rerun button!";
```

This is useful too, but what about those users with little-to-no coding experience?

## Jutsu

Kajero includes Jutsu, a very simple graphing library built with support for [Smolder](https://www.github.com/JoelOtter/smolder).

Smolder is a 'type system' (not really, but I'm not sure what to call it) for JavaScript, which will attempt to automatically restructure arbitrary data to fit a provided schema for a function. The actual reshaping is done by a library called, predictably, [Reshaper](https://www.github.com/JoelOtter/reshaper).

From a user's perspective, the details don't really matter. Let's use Jutsu (available in Kajero code samples as **graphs**) to create a pie chart, based on the most popular GitHub repositories of 2016.

```javascript; runnable
// Here's what the 'popular' data looks like before it's reshaped.
return data.popular;
```

```javascript; runnable
// The graph functions return the reshaped data, so we can see
// what's going on.
return graphs.pieChart(data.popular);
```

It's worked! Smolder knows that a pie chart needs labels and numerical values, so it's reshaped the data to get these.

However, it's picked the first number it could find for the value, which in this case looks to be the repo IDs. This isn't really useful for a pie chart! We'd rather look at something like the number of stargazers. We can pass in a 'hint', to tell Jutsu which value we care about.

```javascript; runnable
return graphs.pieChart(data.popular, 'stargazers_count');
```

We can give multiple hints. Let's say we want to use the name of the repository.

```javascript; runnable
return graphs.pieChart(data.popular, ['name', 'stargazers_count']);
```

Good, that's a bit more readable.

It's kind of hard to compare the stargazers counts in a pie chart - they're all relatively similar. Let's try a bar chart instead.

```javascript; runnable
return graphs.barChart(data.popular, 'Repo', 'Stargazers', ['name', 'stargazers_count']);
```

This is a bit more useful. We can put labels on the axes too, to make sure the graph is easy to understand.

The idea is that it should be possible to use Kajero to investigate and write about trends in data. Let's conduct a toy investigation of our own - is there any relation between a repository's star count and the number of open issues it has?

Let's try a line graph.

```javascript; runnable
return graphs.lineChart(
    data.popular.items, 'Open Issues', 'Stargazers',
    ['open_issues', 'stargazers_count', 'name']
);
```

The extra hint, _name_, is used to provide labels for the data points. All the graphs are interactive - try mousing over them.

It's pretty easy to see which repository has the most open issues (for me it's chakra-core; it might have changed by the time you read this!) and which has the most stargazers. However, it's hard to see a trend here.

A much better graph for investigating correlation is a scatter plot.

```javascript; runnable
return graphs.scatterPlot(
    data.popular.items, 'Open Issues', 'Stargazers',
    ['open_issues', 'stargazers_count', 'name']
);
```

There might be a trend there, but it's hard to see. Maybe we need more data.

The GitHub API lets us request up to 100 results per page, with a default of 30. While the **popular** data source just uses the default, I've also included **extra**, which has 100. Let's try our scatter plot with 100 data points!

```javascript; runnable
return graphs.scatterPlot(
    data.extra.items, 'Open Issues', 'Stargazers',
    ['open_issues', 'stargazers_count', 'name']
);
```

This is a little better. We can see there might be a slight positive correlation, though there are a lot of outliers.

## What's next?

Hopefully this notebook has given you a decent explanation of what Kajero is for. Here are the next things needing done:

- Exporting the notebook
- Making Reshaper smarter
- More graphs
- Exporting to Gist (if there's time!)

Why not try making your own notebook? This one is forked from a [blank notebook](http://www.joelotter.com/kajero/blank) - have a play with the editor!
