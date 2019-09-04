{
  const asg = Object.assign
  const primitiveTypes = ['Bool', 'Int', 'Float', 'String', 'Date', 'Any', 'Void']
  const voidType = {
    type: 'Void'
  }
}

Start
 = BionicTag

// COMMENT TEXT

CommentText
 = lines:(EmptyLine/Tag/Line)* {
   return lines
 }

Tag 'tag'
 = Space* '*'? Space* '@' tagName:$LetterAndDigit* firstLine:$SpacesAndSolidText* EndOfLineOrFile? otherLines:(EmptyLine* Line+)* EmptyLine* {
   firstLine = firstLine.trim()
   const otherLinesJoined = otherLines.map(lines => lines[0].join('\n') + lines[1].join('\n'))
   const separator = firstLine.length > 0 ? ' ' : ''
   const allLines = [firstLine, ...otherLinesJoined]
   return `@${tagName}${separator}${allLines.join('\n')}`
 }

EmptyLine 'empty line'
 = (EndOfLine / (('*' Space+ / '*' / Space+ '*' Space* / Space+) EndOfLineOrFile)) {
   return ''
 }

Line 'line'
 = Space* '*'? Space* solidText:$(SpacesAndSolidTextWithoutAt+ SpacesAndSolidText*) Space* EndOfLineOrFile {
   return solidText
 }


// TAGS SWITCH

Tags
  = '@bionic' TagBody {
    return 'BionicTag'
  } /
  ('@description' / '@desc') TagBody {
    return 'DescriptionTag'
  } / .* {
    return 'UnknownTag'
  }


// BIONIC TAG

BionicTag
  = _ '@bionic' info:MethodDefinition? typeInfo:(__ TypeDefinition)? _ {
    let annotation = {}
    annotation = asg(annotation, info)
    if (typeInfo)
      annotation = asg(annotation, {typeInfo: typeInfo[1]})
    return annotation
  }

MethodDefinition 'method definition'
  = modifiers: (__ MethodModifier)* kinds: (__ MethodKinds) __ name: Identifier {
    return asg({name}, {modifiers:modifiers.map(m => m[1])}, {kinds: kinds[1]})
  }

MethodModifier 'method modifier'
  = 'static' / 'async'

MethodKinds 'method kinds'
  = ('get'__'set' / 'set'__'get') {return ['get', 'set']} /
    'get' {return ['get']} /
    'set' {return ['set']} /
    'method' {return ['method']}

Identifier 'identifier'
  = left: $([_a-z]i+ ([0-9] / [a-z]i)*)
  / ([0-9]+) {
    const loc = location().start
    throw new Error(`Line ${loc.line}, column ${loc.column}: Identifiers cannot start with digits.`)
  }

TypeDefinition 'type definition'
  = arrayType: ArrayDefinition {
    return arrayType
  }
  / type: Identifier {
    if (primitiveTypes.includes(type)) {
      return {
        type: type
      }
    } else {
      return {
        type: 'Object',
        className: type
      }
    }
  }
  / lambdaType: LambdaDefinition {
    return lambdaType
  }

ArrayDefinition 'array definition'
  = 'Array' _ '<' _ elementType: TypeDefinition _ '>' {
    return {
      type: 'Array',
      elementType
    }
  }

LambdaDefinition 'lambda definition'
  = '(' _ left: Parameter? ')' right: (_ '=>' _ TypeDefinition)? {
  	return {
      type: 'Lambda',
      parameters: left || [],
      returnType:right ? right[3] : voidType
    }
  }

Parameter 'parameter definition'
  = params: ((_ Identifier _ ':')? _ TypeDefinition _ ','?)* {
    return params.map(param => asg({type: param[2]}, param[0] ? {name: param[0][1]} : {}))
  }

// DESCRIPTION TAG

DescriptionTag
  = SpaceOrNewLine* ('@description'/'@desc') desc:$TagBody {
  return desc.trim()
}

DescriptionText 'description text'
  = SpaceOrNewLine* [^ \t\n\r]+


// COMMON TAGS

LetterAndDigit 'a letter or a digit'
  = [0-9a-z]i

Space 'a space'
  = [ \t]

SpacesAndSolidText 'spaces or text'
  = Space* [^ \t\n\r]+

SpacesAndSolidTextWithoutAt 'spaces or text but not @'
  = Space* [^ @\t\n\r]+

EndOfLine 'end of line'
  = [\n\r]

EndOfFile 'end of file'
  = !.

EndOfLineOrFile 'end of line or file'
  = EndOfLine / EndOfFile

SpaceOrNewLine 'space or new line'
  = [ \t\n\r]

TagBody
  = (SpaceOrNewLine .*) / EndOfFile

__ 'at least one space'
  = SpaceOrNewLine+

_ 'optional white space'
  = SpaceOrNewLine*