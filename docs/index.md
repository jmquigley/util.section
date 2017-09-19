## Functions

<dl>
<dt><a href="#section">section(text, pos, lines, threshold)</a> ⇒ <code>Section</code></dt>
<dd><p>Retrieves a section of text from the given input text string.  It starts at
the given position and works forward/backward through the string looking for
newline characters.  The search threshold for the number of lines in each
direction is set by the lines parameter.  When the number of newlines, in a
direction is found, then the start/end position offsets from the text buffer
are found.</p>
<p>Setting the <code>lines</code> to 0 will just retrieve the current line.</p>
</dd>
<dt><a href="#line">line(text, pos)</a> ⇒ <code>Section</code></dt>
<dd><p>Retrieves the current full line from the given input text.  This uses the
newline character from the operating system to determine the beginning and
end of the line.  The function is syntactic sugar for the section function.</p>
</dd>
<dt><a href="#word">word(text, pos)</a> ⇒ <code>Section</code></dt>
<dd><p>This call will retrieve the current word at the given cursor location.  A
word is considered an alphanumeric value surrounded by white space.</p>
</dd>
</dl>

<a name="section"></a>

## section(text, pos, lines, threshold) ⇒ <code>Section</code>
Retrieves a section of text from the given input text string.  It starts at
the given position and works forward/backward through the string looking for
newline characters.  The search threshold for the number of lines in each
direction is set by the lines parameter.  When the number of newlines, in a
direction is found, then the start/end position offsets from the text buffer
are found.

Setting the `lines` to 0 will just retrieve the current line.

**Kind**: global function  
**Returns**: <code>Section</code> - an object that represents the section found.  This contains
the absolute start/end of the section, and a reference to this section.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | the base text string to extract the substring |
| pos | <code>number</code> |  | the starting position within the text string to start looking for newlines. |
| lines | <code>number</code> | <code>30</code> | the number of lines above and below the start position line to include (this number is *2).  e.g. 5, would have five lines above, five lines below, and the line the cursor is on (11 total). |
| threshold | <code>number</code> | <code>300</code> | if the size of the buffer is below this number then just return the whole buffer (don't search when under threshold) |

<a name="line"></a>

## line(text, pos) ⇒ <code>Section</code>
Retrieves the current full line from the given input text.  This uses the
newline character from the operating system to determine the beginning and
end of the line.  The function is syntactic sugar for the section function.

**Kind**: global function  
**Returns**: <code>Section</code> - an object that represents the section found.  This contains
the absolute start/end of the line, and a reference to this line.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the block of text to perform the search. |
| pos | <code>number</code> | the current absolute position within the text block |

<a name="word"></a>

## word(text, pos) ⇒ <code>Section</code>
This call will retrieve the current word at the given cursor location.  A
word is considered an alphanumeric value surrounded by white space.

**Kind**: global function  
**Returns**: <code>Section</code> - an object that represents the section found.  This contains
the absolute start/end of the word, and a reference to this word.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the block of text to perform the search. |
| pos | <code>number</code> | the current absolute position within the text block |

